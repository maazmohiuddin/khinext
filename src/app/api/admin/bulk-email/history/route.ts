/**
 * GET /api/admin/bulk-email/history
 * Returns bulk email logs with per-recipient send records and open counts.
 * Admin-only.
 */
import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const svc = createServiceClient();

  const { data: logs, error } = await svc
    .from("bulk_email_logs")
    .select("*")
    .order("sent_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!logs || logs.length === 0) return NextResponse.json({ logs: [] });

  // Fetch per-recipient records for all logs
  const logIds = logs.map(l => l.id);
  const { data: records } = await svc
    .from("email_send_records")
    .select("id, log_id, email, delivery_status, mx_valid, opened_at, open_count, last_opened_at, smtp_error")
    .in("log_id", logIds)
    .order("email", { ascending: true });

  // Group records by log_id
  const recordsByLog = new Map<string, typeof records>();
  for (const rec of records ?? []) {
    const arr = recordsByLog.get(rec.log_id) ?? [];
    arr.push(rec);
    recordsByLog.set(rec.log_id, arr);
  }

  const enriched = logs.map(log => {
    const recs = recordsByLog.get(log.id) ?? [];
    const totalOpens = recs.reduce((sum, r) => sum + (r.open_count ?? 0), 0);
    const uniqueOpeners = recs.filter(r => (r.open_count ?? 0) > 0).length;
    return { ...log, records: recs, total_opens: totalOpens, unique_openers: uniqueOpeners };
  });

  return NextResponse.json({ logs: enriched });
}
