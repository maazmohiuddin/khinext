import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { randomBytes, randomUUID } from "crypto";
import { headers } from "next/headers";

export const runtime = "nodejs";

// In-memory rate limit: 10 uploads per IP per minute
const rlMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  let entry = rlMap.get(ip);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + 60_000 };
    rlMap.set(ip, entry);
  }
  entry.count++;
  return entry.count <= 10;
}

export async function POST(req: Request) {
  const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let form: FormData;
  try { form = await req.formData(); }
  catch { return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 }); }

  const image = form.get("image");
  if (!(image instanceof Blob)) {
    return NextResponse.json({ error: "Missing 'image' field" }, { status: 400 });
  }

  if (image.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "Image too large (max 4 MB)" }, { status: 413 });
  }

  const name        = ((form.get("name")        as string | null) ?? "").trim();
  const template    = ((form.get("template")    as string | null) ?? "standard").trim();
  const designation = ((form.get("designation") as string | null) ?? "").trim();

  const svc = createServiceClient();

  // Dedup: same name+template within the last 5 minutes → return existing record
  if (name) {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: existing } = await svc
      .from("card_shares")
      .select("id, slug")
      .eq("name", name)
      .eq("template", template)
      .gte("created_at", fiveMinutesAgo)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { data: { publicUrl } } = svc.storage
        .from("card-images")
        .getPublicUrl(`${existing.id}.jpg`);
      return NextResponse.json({ id: existing.id, slug: existing.slug, url: publicUrl });
    }
  }

  const id   = randomUUID();
  const slug = randomBytes(4).toString("base64url");
  const key  = `${id}.jpg`;
  const buf  = Buffer.from(await image.arrayBuffer());

  const { error: uploadError } = await svc.storage
    .from("card-images")
    .upload(key, buf, { contentType: "image/jpeg", upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { error: dbError } = await svc
    .from("card_shares")
    .insert({
      id,
      slug,
      name:        name        || null,
      template,
      designation: designation || null,
    });

  if (dbError) {
    console.error("[card/share] card_shares insert:", dbError.message);
  }

  const { data: { publicUrl } } = svc.storage
    .from("card-images")
    .getPublicUrl(key);

  return NextResponse.json({ id, slug, url: publicUrl });
}
