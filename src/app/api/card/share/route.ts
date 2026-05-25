/**
 * POST /api/card/share
 * Accepts a JPEG blob (FormData field "image"), stores it in the
 * public "card-images" Supabase Storage bucket, and returns a
 * { id, url } that can be embedded in a shareable link.
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

  const id  = randomUUID();
  const key = `${id}.jpg`;
  const buf = Buffer.from(await image.arrayBuffer());

  const svc = createServiceClient();
  const { error } = await svc.storage
    .from("card-images")
    .upload(key, buf, { contentType: "image/jpeg", upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: { publicUrl } } = svc.storage
    .from("card-images")
    .getPublicUrl(key);

  return NextResponse.json({ id, url: publicUrl });
}
