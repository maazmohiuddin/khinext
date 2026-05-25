import type { Metadata } from "next";
import { CardGenerator } from "./CardGenerator";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { card?: string; t?: string; n?: string; d?: string };
}): Promise<Metadata> {
  const name   = searchParams.n ? decodeURIComponent(searchParams.n) : null;
  const isVip  = searchParams.t === "vip";
  const cardId = searchParams.card;

  const ogImage = cardId
    ? `${SUPABASE_URL}/storage/v1/object/public/card-images/${cardId}.jpg`
    : undefined;

  const title = name
    ? `${name} is attending KHINEXT '26${isVip ? " as a VIP Delegate" : ""}`
    : "Create Your KHINEXT '26 Digital Card";

  const description = name
    ? `Join ${name} at Asia's First Multi Domain AI and Innovation Summit — June 7, 2026, PC Hotel Karachi.`
    : "Personalise your KHINEXT '26 attendance card and share it on LinkedIn, Instagram, and Facebook.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage, width: 1080, height: 1080, alt: title }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default function CardGeneratorPage() {
  return <CardGenerator />;
}
