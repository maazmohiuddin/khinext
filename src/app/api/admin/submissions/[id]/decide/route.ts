import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";

interface DecideBody {
  decision: "approved" | "rejected";
  note?: string;
}

/**
 * POST /api/admin/submissions/[id]/decide
 *   { decision: "approved" | "rejected", note?: string }
 *
 * Approves or rejects an AI Expo submission.
 *   1. Require an authenticated user.
 *   2. Verify the user is in the admins whitelist via is_admin() RPC.
 *   3. Update the submission with status + reviewer metadata.
 *   4. (TODO) Trigger an outbound approval email via Resend / SES.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = createServerSupabaseClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { data: isAdmin } = await auth.rpc("is_admin");
  if (!isAdmin) {
    return NextResponse.json({ error: "Not an admin." }, { status: 403 });
  }

  let body: DecideBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (body.decision !== "approved" && body.decision !== "rejected") {
    return NextResponse.json({ error: "Invalid decision." }, { status: 400 });
  }

  // Service-role client so we don't depend on user-RLS for the update path.
  const svc = createServiceClient();
  const { data: updated, error } = await svc
    .from("submissions")
    .update({
      status: body.decision,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      review_note: body.note ?? null,
    })
    .eq("id", params.id)
    .select("*")
    .single();

  if (error || !updated) {
    return NextResponse.json({ error: error?.message ?? "Update failed." }, { status: 500 });
  }

  // Outbound email — wire in your provider here (Resend / Postmark / SES).
  // For the prototype this is a no-op; the Email Preview UI shows what would be sent.

  return NextResponse.json({ ok: true, submission: updated });
}
