/**
 * POST /api/card/share
 * Uploads the JPEG card image and stores metadata (name, template,
 * designation) + a short 8-char slug in card_shares.
 * Returns { id, slug, url } — the slug powers the short share URL /c/{slug}.
 */
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { randomBytes, randomUUID } from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
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

  const id   = randomUUID();
  const slug = randomBytes(4).toString("base64url"); // exactly 6 URL-safe chars
  const key  = `${id}.jpg`;
  const buf  = Buffer.from(await image.arrayBuffer());

  const svc = createServiceClient();

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
