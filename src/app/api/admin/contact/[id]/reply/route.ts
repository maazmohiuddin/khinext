import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";
import { sendContactReply } from "@/lib/email";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { replyText } = await req.json() as { replyText: string };
    if (!replyText?.trim()) return NextResponse.json({ error: "Reply text is required." }, { status: 400 });

    const svc = createServiceClient();
    const { data: msg, error: fetchErr } = await svc
      .from("contact_messages")
      .select("*")
      .eq("id", params.id)
      .single();

    if (fetchErr || !msg) return NextResponse.json({ error: "Message not found." }, { status: 404 });

    await sendContactReply({
      to: msg.email,
      toName: msg.name,
      subject: msg.subject,
      originalMessage: msg.message,
      replyText: replyText.trim(),
    });

    const now = new Date().toISOString();
    const existingReplies: { text: string; sent_at: string }[] = Array.isArray(msg.replies) ? msg.replies : [];

    await svc.from("contact_messages").update({
      status: "replied",
      reply_text: replyText.trim(),
      replied_at: now,
      replies: [...existingReplies, { text: replyText.trim(), sent_at: now }],
    }).eq("id", params.id);

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Contact reply error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
