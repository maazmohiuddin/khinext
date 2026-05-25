/**
 * POST /api/admin/bulk-email/send
 * Sends "You Are Invited" emails with per-recipient open-pixel tracking.
 * Creates bulk_email_logs + email_send_records rows. Admin-only.
 */
import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";
import { renderInvitationEmail, INVITATION_SUBJECT, type CustomInvitationParams } from "@/lib/email/invitation";
import { sendRawEmail, injectTrackingPixel } from "@/lib/smtp";
import { resolveMx } from "dns/promises";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://khinext.vercel.app";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MX_CACHE = new Map<string, boolean>();

async function checkMx(domain: string): Promise<boolean> {
  if (MX_CACHE.has(domain)) return MX_CACHE.get(domain)!;
  try {
    const records = await Promise.race([
      resolveMx(domain),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 4000)),
    ]);
    const valid = records.length > 0;
    MX_CACHE.set(domain, valid);
    return valid;
  } catch {
    MX_CACHE.set(domain, false);
    return false;
  }
}

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: {
    emails?: unknown; subject?: unknown;
    headline?: unknown; bodyText?: unknown; ctaLabel?: unknown; ctaUrl?: unknown;
  };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const emails = body.emails;
  if (!Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json({ error: "emails must be a non-empty array" }, { status: 400 });
  }

  const valid: string[] = [];
  const invalid: string[] = [];
  for (const e of emails) {
    if (typeof e === "string" && EMAIL_RE.test(e.trim())) valid.push(e.trim().toLowerCase());
    else invalid.push(String(e));
  }
  if (valid.length === 0) {
    return NextResponse.json({ error: "No valid email addresses provided", invalid }, { status: 400 });
  }

  const subject = typeof body.subject === "string" && body.subject.trim()
    ? body.subject.trim() : INVITATION_SUBJECT;

  const custom: CustomInvitationParams = {
    ...(typeof body.headline === "string" && body.headline.trim() ? { headline: body.headline.trim() } : {}),
    ...(typeof body.bodyText === "string" && body.bodyText.trim() ? { bodyText: body.bodyText.trim() } : {}),
    ...(typeof body.ctaLabel === "string" && body.ctaLabel.trim() ? { ctaLabel: body.ctaLabel.trim() } : {}),
    ...(typeof body.ctaUrl === "string" && body.ctaUrl.trim() ? { ctaUrl: body.ctaUrl.trim() } : {}),
  };

  const svc = createServiceClient();

  // 1. Create the log row first to get log_id
  const { data: log, error: logErr } = await svc
    .from("bulk_email_logs")
    .insert({
      sent_by: user.id,
      subject,
      total_count: valid.length,
      sent_count: 0,
      failed_count: 0,
      recipients: [],
      failed_recipients: [],
    })
    .select("id")
    .single();

  if (logErr || !log) {
    return NextResponse.json({ error: "Failed to create log entry" }, { status: 500 });
  }
  const logId = log.id as string;

  // 2. Render base HTML once (pixel injected per-recipient)
  const baseHtml = renderInvitationEmail(custom);
  const plainText = baseHtml
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // 3. Send per-recipient with tracking
  const sentList: string[] = [];
  const failedList: { email: string; error: string }[] = [];

  for (const email of valid) {
    // MX check (domain-level cache)
    const domain = email.split("@")[1];
    const mxValid = await checkMx(domain);

    // Create send record → get record_id for pixel URL
    const { data: rec } = await svc
      .from("email_send_records")
      .insert({ log_id: logId, email, delivery_status: "pending", mx_valid: mxValid })
      .select("id")
      .single();

    const recordId = rec?.id as string | undefined;

    // Inject tracking pixel if we have a record ID
    const html = recordId
      ? injectTrackingPixel(baseHtml, `${SITE_URL}/api/track/open?rid=${recordId}`)
      : baseHtml;

    try {
      const result = await sendRawEmail({ to: email, subject, html, text: plainText });
      sentList.push(email);
      if (recordId) {
        await svc.from("email_send_records").update({
          delivery_status: "sent",
          smtp_message_id: result.messageId,
        }).eq("id", recordId);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      failedList.push({ email, error: errMsg });
      if (recordId) {
        await svc.from("email_send_records").update({
          delivery_status: "failed",
          smtp_error: errMsg,
        }).eq("id", recordId);
      }
    }
  }

  // 4. Update log with final counts
  await svc.from("bulk_email_logs").update({
    sent_count: sentList.length,
    failed_count: failedList.length,
    recipients: sentList,
    failed_recipients: failedList,
  }).eq("id", logId);

  return NextResponse.json({
    ok: true,
    total: valid.length,
    sent: sentList.length,
    failed: failedList.length,
    sentList,
    failedList,
    ...(invalid.length > 0 ? { skippedInvalid: invalid } : {}),
  });
}
