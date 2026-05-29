import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { CardViewCard } from "@/app/card-view/CardViewCard";

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const SITE_URL     = (process.env.NEXT_PUBLIC_SITE_URL || "https://khinext.com").replace(/\/$/, "");

function cardImageUrl(id: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/card-images/${id}.jpg`;
}

type CardMeta = { id: string; name: string | null; template: string; designation: string | null };

const getCard = cache(async (slug: string): Promise<CardMeta | null> => {
  try {
    const svc = createServiceClient();
    const { data } = await svc
      .from("card_shares")
      .select("id, name, template, designation")
      .eq("slug", slug)
      .single();
    return data as CardMeta | null;
  } catch {
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const card = await getCard(params.slug);
  if (!card) return { title: "Card not found" };

  const isVip  = card.template === "vip";
  const ogImage = cardImageUrl(card.id);

  const title = card.name
    ? `${card.name} is attending KHINEXT '26${isVip ? " as a VIP Delegate" : ""}`
    : "KHINEXT '26 — Attendance Card";

  const description = card.name
    ? `Join ${card.name} at Asia's First Multi Domain AI and Innovation Summit — June 7, 2026, PC Hotel Karachi.`
    : "Asia's First Multi Domain AI and Innovation Summit — June 7, 2026, PC Hotel Karachi.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/c/${params.slug}`,
      images: [{ url: ogImage, width: 1080, height: 1080, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ShortCardPage({
  params,
}: {
  params: { slug: string };
}) {
  const card = await getCard(params.slug);
  if (!card) notFound();

  const isVip  = card.template === "vip";
  const imgUrl = cardImageUrl(card.id);

  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center px-6 py-14 md:py-20">

      <p className="kx-eyebrow mb-4">KHINEXT &apos;26</p>

      <h1 className="font-display font-extrabold text-white text-3xl md:text-4xl -tracking-tight text-center mb-4">
        {card.name ? (
          <>
            {card.name}&rsquo;s{" "}
            <span className={isVip ? "text-[#FFB800]" : "kx-accent"}>
              {isVip ? "VIP Delegate" : "Attendance"} Card
            </span>
          </>
        ) : (
          <span className="kx-accent">Attendance Card</span>
        )}
      </h1>

      {card.designation && (
        <p className="text-sm mb-8" style={{ color: "#FFB800" }}>{card.designation}</p>
      )}
      {!card.designation && <div className="mb-8" />}

      <CardViewCard
        imgUrl={imgUrl}
        alt={card.name ? `${card.name}'s KHINEXT '26 attendance card` : "KHINEXT '26 attendance card"}
        isVip={isVip}
      />

      <div className="flex flex-col items-center gap-3 w-full max-w-[320px] mt-10">
        <a
          href={imgUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="kx-btn kx-btn-outline w-full justify-center"
        >
          <Download size={15} />
          Save Card
        </a>
        <Link href="/card-generator" className="kx-btn kx-btn-primary w-full justify-center">
          Create Your Own Card
          <ArrowRight size={15} />
        </Link>
      </div>

      <p className="mt-10 text-xs text-white/25 text-center max-w-xs">
        Asia&apos;s First Multi Domain AI Summit &middot; June 7, 2026 &middot; PC Hotel, Karachi
      </p>
    </main>
  );
}
