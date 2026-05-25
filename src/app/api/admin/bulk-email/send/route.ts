/**
 * POST /api/admin/bulk-email/send
 * Sends the "You Are Invited" email to a list of recipients via SMTP.
 * Admin-only endpoint.
 */
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendSmtpEmailsBulk } from "@/lib/smtp";
import { INVITATION_SUBJECT, INVITATION_BODY_PARAMS } from "@/lib/email/invitation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // Auth guard
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { emails?: unknown; subject?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const emails = body.emails;
  if (!Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json({ error: "emails must be a non-empty array" }, { status: 400 });
  }

  // Validate email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid: string[] = [];
  const invalid: string[] = [];
  for (const e of emails) {
    if (typeof e === "string" && emailRegex.test(e.trim())) {
      valid.push(e.trim().toLowerCase());
    } else {
      invalid.push(String(e));
    }
  }

  if (valid.length === 0) {
    return NextResponse.json({ error: "No valid email addresses provided", invalid }, { status: 400 });
  }

  const subject = typeof body.subject === "string" && body.subject.trim()
    ? body.subject.trim()
    : INVITATION_SUBJECT;

  const { sent, failed } = await sendSmtpEmailsBulk(valid, { subject, ...INVITATION_BODY_PARAMS });

  return NextResponse.json({
    ok: true,
    total: valid.length,
    sent: sent.length,
    failed: failed.length,
    sentList: sent,
    failedList: failed,
    ...(invalid.length > 0 ? { skippedInvalid: invalid } : {}),
  });
}
