/**
 * IMAP sync helper — fetches emails from info@khinext.com inbox
 * and saves unseen ones to the contact_messages table.
 *
 * Two-pass strategy:
 *   1. Fetch lightweight envelopes for the whole window (fast, even for
 *      thousands of messages) to discover Message-IDs.
 *   2. Fetch the full source ONLY for messages we haven't stored yet.
 * This keeps each sync fast and lets us scan a wide window without
 * re-downloading bodies we already have.
 *
 * Server-only.
 */
import { ImapFlow } from "imapflow";
import { simpleParser, type ParsedMail } from "mailparser";
import { createServiceClient } from "@/lib/supabase/server";
import { Readable } from "stream";

function stripHtml(html: string) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function syncInboxEmails(): Promise<{ imported: number; skipped: number; error?: string }> {
  const pass = process.env.SMTP_PASS;
  if (!pass) return { imported: 0, skipped: 0, error: "SMTP_PASS not configured" };

  const client = new ImapFlow({
    host: process.env.SMTP_HOST ?? "mail.khinext.com",
    port: 993,
    secure: true,
    auth: {
      user: process.env.SMTP_USER ?? "info@khinext.com",
      pass,
    },
    tls: { rejectUnauthorized: false },
    logger: false,
  });

  const svc = createServiceClient();
  const ownAddress = (process.env.SMTP_USER ?? "info@khinext.com").toLowerCase();
  let imported = 0;
  let skipped = 0;

  try {
    await client.connect();
    const lock = await client.getMailboxLock("INBOX");

    try {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const uids = await client.search({ since }, { uid: true });
      const uidArray = Array.isArray(uids) ? uids : [];
      if (!uidArray.length) return { imported: 0, skipped: 0 };

      // Scan the most recent slice of the window.
      const windowUids = uidArray.slice(-300);

      // ── Pass 1: envelopes only → find which messages are new ──
      const candidates: { uid: number; messageId: string }[] = [];
      for await (const env of client.fetch(windowUids, { envelope: true }, { uid: true })) {
        const messageId = env.envelope?.messageId ?? `imap-uid-${env.uid}`;
        candidates.push({ uid: env.uid, messageId });
      }

      if (!candidates.length) return { imported: 0, skipped: 0 };

      // Which of these Message-IDs do we already have?
      const ids = candidates.map(c => c.messageId);
      const { data: existingRows } = await svc
        .from("contact_messages")
        .select("imap_message_id")
        .in("imap_message_id", ids);

      const known = new Set((existingRows ?? []).map(r => r.imap_message_id));
      const newUids = candidates.filter(c => !known.has(c.messageId)).map(c => c.uid);
      skipped += candidates.length - newUids.length;

      if (!newUids.length) return { imported, skipped };

      // ── Pass 2: full source for new messages only → parse + insert ──
      for await (const msg of client.fetch(newUids, { source: true }, { uid: true })) {
        try {
          if (!msg.source) { skipped++; continue; }

          const parsed: ParsedMail = await simpleParser(Readable.from(msg.source));
          const messageId = parsed.messageId ?? `imap-uid-${msg.uid}`;

          const fromAddr = parsed.from?.value[0];
          const name = fromAddr?.name?.trim() || fromAddr?.address || "Unknown";
          const email = fromAddr?.address?.toLowerCase() || "";

          // Never ingest our own outbound copies.
          if (email === ownAddress) { skipped++; continue; }

          const htmlContent = typeof parsed.html === "string" ? parsed.html : "";
          const body = parsed.text?.trim() || stripHtml(htmlContent) || "(no body)";
          const subject = parsed.subject?.trim() || "(no subject)";

          const { error: insertErr } = await svc.from("contact_messages").insert({
            name,
            email,
            subject,
            message: body,
            source: "email",
            imap_message_id: messageId,
            created_at: parsed.date?.toISOString() ?? new Date().toISOString(),
          });

          if (insertErr) { skipped++; continue; }
          imported++;
        } catch {
          skipped++;
        }
      }
    } finally {
      lock.release();
    }

    await client.logout();
  } catch (e) {
    return { imported, skipped, error: e instanceof Error ? e.message : String(e) };
  }

  return { imported, skipped };
}
