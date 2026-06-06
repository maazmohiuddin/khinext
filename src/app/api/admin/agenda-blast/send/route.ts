import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";
import {
  renderInvitationEmail, AGENDA_SUBJECT, type CustomInvitationParams,
} from "@/lib/email/invitation";
import { sendRawEmail, injectTrackingPixel } from "@/lib/smtp";
import { resolveMx } from "dns/promises";

export const runtime = "nodejs";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://khinext.vercel.app").replace(/\/$/, "");
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
    batchSize?: unknown;
    headline?: unknown; bodyText?: unknown;
    ctaLabel?: unknown; ctaUrl?: unknown;
  };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const batchSize = typeof body.batchSize === "number" && body.batchSize > 0
    ? Math.min(Math.floor(body.batchSize), 500) : 100;

  const svc = createServiceClient();

  // All emails ever successfully delivered
  const { data: allRecords } = await svc
    .from("email_send_records")
    .select("email")
    .eq("delivery_status", "sent");

  const allEmails = Array.from(new Set((allRecords ?? []).map(r => r.email as string)));

  // Agenda blast log IDs
  const { data: agendaLogs } = await svc
    .from("bulk_email_logs")
    .select("id")
    .eq("subject", AGENDA_SUBJECT);

  const agendaLogIds = (agendaLogs ?? []).map(l => l.id as string);
  let agendaSentEmails: string[] = [];
  if (agendaLogIds.length > 0) {
    const { data: agendaRecords } = await svc
      .from("email_send_records")
      .select("email")
      .in("log_id", agendaLogIds)
      .eq("delivery_status", "sent");
    agendaSentEmails = Array.from(new Set((agendaRecords ?? []).map(r => r.email as string)));
  }

  const agendaSentSet = new Set(agendaSentEmails);
  const remaining = allEmails.filter(e => !agendaSentSet.has(e));
  const batch = remaining.slice(0, batchSize);

  if (batch.length === 0) {
    return NextResponse.json({
      ok: true,
      total: 0, sent: 0, failed: 0,
      sentList: [], failedList: [],
      remainingAfter: 0,
      message: "All invitees have already received the agenda email.",
    });
  }

  const custom: CustomInvitationParams = {
    includeAgenda: true,
    ...(typeof body.headline === "string" && body.headline.trim() ? { headline: body.headline.trim() } : {}),
    ...(typeof body.bodyText === "string" && body.bodyText.trim() ? { bodyText: body.bodyText.trim() } : {}),
    ...(typeof body.ctaLabel === "string" && body.ctaLabel.trim() ? { ctaLabel: body.ctaLabel.trim() } : {}),
    ...(typeof body.ctaUrl === "string" && body.ctaUrl.trim() ? { ctaUrl: body.ctaUrl.trim() } : {}),
  };

  const subject = AGENDA_SUBJECT;
  const baseHtml = renderInvitationEmail(custom);
  const plainText = baseHtml
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const { data: log, error: logErr } = await svc
    .from("bulk_email_logs")
    .insert({
      sent_by: user.id,
      subject,
      total_count: batch.length,
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
  const sentList: string[] = [];
  const failedList: { email: string; error: string }[] = [];

  for (const email of batch) {
    const domain = email.split("@")[1];
    const mxValid = await checkMx(domain);

    const { data: rec } = await svc
      .from("email_send_records")
      .insert({ log_id: logId, email, delivery_status: "pending", mx_valid: mxValid })
      .select("id")
      .single();

    const recordId = rec?.id as string | undefined;
    const pixelUrl = recordId ? `${SITE_URL}/api/track/open?rid=${recordId}` : null;

    let html = baseHtml;
    if (pixelUrl) html = injectTrackingPixel(html, pixelUrl);

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

  await svc.from("bulk_email_logs").update({
    sent_count: sentList.length,
    failed_count: failedList.length,
    recipients: sentList,
    failed_recipients: failedList,
  }).eq("id", logId);

  return NextResponse.json({
    ok: true,
    total: batch.length,
    sent: sentList.length,
    failed: failedList.length,
    sentList,
    failedList,
    remainingAfter: remaining.length - sentList.length,
  });
}
