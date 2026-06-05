/**
 * Gmail REST API sync — fetches reply threads from the configured Gmail account
 * and saves unseen ones to the contact_messages table.
 *
 * Required env vars (set in .env.local / Vercel env):
 *   GMAIL_CLIENT_ID      — Google OAuth2 client ID
 *   GMAIL_CLIENT_SECRET  — Google OAuth2 client secret
 *   GMAIL_REFRESH_TOKEN  — long-lived refresh token for the account
 *
 * Optional:
 *   GMAIL_SEARCH_QUERY   — Gmail search string (default: "to:info@khinext.com")
 *   IMAP_FILTER_TO       — comma-separated addresses we accept mail for
 *   SMTP_USER            — fallback "own address" to skip outbound copies
 *
 * Server-only.
 */

import { createServiceClient } from "@/lib/supabase/server";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GMAIL_API = "https://gmail.googleapis.com/gmail/v1/users/me";

export interface GmailSyncResult {
  imported: number;
  skipped: number;
  error?: string;
}

async function refreshAccessToken(): Promise<string> {
  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } = process.env;
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    throw new Error(
      "Gmail credentials not configured. Add GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN to your env."
    );
  }
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: GMAIL_CLIENT_ID,
      client_secret: GMAIL_CLIENT_SECRET,
      refresh_token: GMAIL_REFRESH_TOKEN,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Google token refresh failed: ${(err as Record<string, string>).error_description ?? (err as Record<string, string>).error ?? res.status}`
    );
  }
  const json = await res.json() as { access_token: string };
  return json.access_token;
}

function b64urlDecode(s: string): string {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
}

function getHeader(headers: Array<{ name: string; value: string }>, name: string): string {
  return headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

interface Parts { text: string; html: string }

function extractBody(part: Record<string, unknown>): Parts {
  const mime = (part.mimeType as string) ?? "";
  const body = part.body as { data?: string } | undefined;
  const subparts = part.parts as Array<Record<string, unknown>> | undefined;

  if (mime === "text/plain" && body?.data) return { text: b64urlDecode(body.data), html: "" };
  if (mime === "text/html"  && body?.data) return { text: "", html: b64urlDecode(body.data) };
  if (subparts) {
    return subparts.reduce<Parts>(
      (acc, p) => { const r = extractBody(p); return { text: acc.text + r.text, html: acc.html + r.html }; },
      { text: "", html: "" }
    );
  }
  return { text: "", html: "" };
}

function stripQuoted(text: string): string {
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l.startsWith(">") || /^On .{10,} wrote:$/.test(l) || /^On .{10,}wrote:$/.test(l)) {
      return lines.slice(0, i).join("\n").trim();
    }
  }
  return text.trim();
}

function htmlToText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function syncGmailInbox(): Promise<GmailSyncResult> {
  const svc = createServiceClient();
  let imported = 0;
  let skipped = 0;

  const token = await refreshAccessToken();
  const auth = { Authorization: `Bearer ${token}` };

  const query = process.env.GMAIL_SEARCH_QUERY ?? "to:info@khinext.com";
  const listRes = await fetch(
    `${GMAIL_API}/threads?q=${encodeURIComponent(query)}&maxResults=100`,
    { headers: auth }
  );
  if (!listRes.ok) {
    const e = await listRes.json().catch(() => ({})) as Record<string, unknown>;
    const msg = (e.error as { message?: string } | undefined)?.message ?? String(listRes.status);
    return { imported: 0, skipped: 0, error: `Gmail API error: ${msg}` };
  }

  const { threads = [] } = await listRes.json() as { threads?: Array<{ id: string }> };
  if (!threads.length) return { imported: 0, skipped: 0 };

  // Dedup against existing gmail-prefixed IDs in the DB.
  const imapIds = threads.map(t => `gmail-${t.id}`);
  const { data: existing } = await svc
    .from("contact_messages")
    .select("imap_message_id")
    .in("imap_message_id", imapIds);

  const known = new Set((existing ?? []).map(r => r.imap_message_id as string));
  const newThreads = threads.filter(t => !known.has(`gmail-${t.id}`));
  skipped = threads.length - newThreads.length;

  if (!newThreads.length) return { imported, skipped };

  const filterRaw = process.env.IMAP_FILTER_TO ?? process.env.SMTP_USER ?? "info@khinext.com";
  const filterTo = filterRaw.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  const ownAddr  = (process.env.SMTP_USER ?? "info@khinext.com").toLowerCase();

  for (const thread of newThreads) {
    try {
      const tRes = await fetch(`${GMAIL_API}/threads/${thread.id}?format=full`, { headers: auth });
      if (!tRes.ok) { skipped++; continue; }

      const { messages = [] } = await tRes.json() as { messages?: Array<Record<string, unknown>> };

      // Use the first inbound message in the thread (someone replying to us).
      for (const msg of messages) {
        const hdrs   = ((msg.payload as Record<string, unknown>)?.headers ?? []) as Array<{ name: string; value: string }>;
        const fromRaw = getHeader(hdrs, "from");
        const fromEmail = (fromRaw.match(/[^\s<>]+@[^\s<>]+/)?.[0] ?? "").toLowerCase();

        // Skip our own outbound mail.
        if (!fromEmail || fromEmail === ownAddr) continue;

        // Only ingest mail addressed to us.
        const toRaw = getHeader(hdrs, "to").toLowerCase();
        if (filterTo.length && !filterTo.some(f => toRaw.includes(f))) continue;

        const { text, html } = extractBody(msg.payload as Record<string, unknown>);
        const rawBody = text || htmlToText(html);
        const body = stripQuoted(rawBody) || rawBody;

        const subject = getHeader(hdrs, "subject") || "(no subject)";
        const internalDate = (msg.internalDate as string) ?? String(Date.now());
        const nameMatch = fromRaw.match(/^"?([^"<]+)"?\s*</);
        const senderName = nameMatch ? nameMatch[1].trim() : fromEmail.split("@")[0];

        const { error: insertErr } = await svc.from("contact_messages").insert({
          name: senderName,
          email: fromEmail,
          subject,
          message: body || "(no body)",
          source: "email",
          imap_message_id: `gmail-${thread.id}`,
          created_at: new Date(Number(internalDate)).toISOString(),
        });

        if (!insertErr) imported++;
        else skipped++;
        break; // one record per thread
      }
    } catch { skipped++; }
  }

  return { imported, skipped };
}
