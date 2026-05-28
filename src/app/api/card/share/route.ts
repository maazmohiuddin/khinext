/**
 * POST /api/card/share
 * Accepts a JPEG blob (FormData field "image") plus optional metadata
 * (name, template, designation). Stores the image in the public
 * "card-images" Supabase Storage bucket and persists metadata in
 * card_shares so the view page can reconstruct the card without
 * embedding personal data in the URL.
 *
 * No auth required — the bucket is world-readable and the service
 * client is used server-side for the upload.
 */
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let form: FormData;
  try { form = await req.formData(); }
  catch { return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 }); }

  const image = form.get("image");
  if (!(image instanceof Blob)) {
    return NextResponse.json({ error: "Missing 'image' field" }, { status: 400 });
  }

  // 4 MB cap (bucket also enforces this)
  if (image.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "Image too large (max 4 MB)" }, { status: 413 });
  }

  const name        = ((form.get("name")        as string | null) ?? "").trim();
  const template    = ((form.get("template")    as string | null) ?? "standard").trim();
  const designation = ((form.get("designation") as string | null) ?? "").trim();

  const id  = randomUUID();
  const key = `${id}.jpg`;
  const buf = Buffer.from(await image.arrayBuffer());

  const svc = createServiceClient();

  const { error: uploadError } = await svc.storage
    .from("card-images")
    .upload(key, buf, { contentType: "image/jpeg", upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Store metadata (non-fatal if it fails — image is still usable)
  const { error: dbError } = await svc
    .from("card_shares")
    .insert({ id, name: name || null, template, designation: designation || null });

  if (dbError) {
    console.error("[card/share] card_shares insert:", dbError.message);
  }

  const { data: { publicUrl } } = svc.storage
    .from("card-images")
    .getPublicUrl(key);

  return NextResponse.json({ id, url: publicUrl });
}
