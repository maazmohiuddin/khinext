/**
 * IMAP sync helper — fetches emails from info@khinext.com inbox
 * and saves unseen ones to the contact_messages table.
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

      const batch = uidArray.slice(-100);

      for await (const msg of client.fetch(batch, { source: true }, { uid: true })) {
        try {
          if (!msg.source) { skipped++; continue; }

          const parsed: ParsedMail = await simpleParser(Readable.from(msg.source));
          const messageId = parsed.messageId ?? `imap-uid-${msg.uid}`;

          const { data: existing } = await svc
            .from("contact_messages")
            .select("id")
            .eq("imap_message_id", messageId)
            .maybeSingle();

          if (existing) { skipped++; continue; }

          const fromAddr = parsed.from?.value[0];
          const name = fromAddr?.name?.trim() || fromAddr?.address || "Unknown";
          const email = fromAddr?.address?.toLowerCase() || "";

          const ownAddress = (process.env.SMTP_USER ?? "info@khinext.com").toLowerCase();
          if (email === ownAddress) { skipped++; continue; }

          const htmlContent = typeof parsed.html === "string" ? parsed.html : "";
          const body = parsed.text?.trim() || stripHtml(htmlContent) || "(no body)";
          const subject = parsed.subject?.trim() || "(no subject)";

          await svc.from("contact_messages").insert({
            name,
            email,
            subject,
            message: body,
            source: "email",
            imap_message_id: messageId,
            created_at: parsed.date?.toISOString() ?? new Date().toISOString(),
          });

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
