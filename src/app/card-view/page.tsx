import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://khinext.com").replace(/\/$/, "");

function cardImageUrl(cardId: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/card-images/${cardId}.jpg`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { card?: string; t?: string; n?: string; d?: string };
}): Promise<Metadata> {
  const name   = searchParams.n ? decodeURIComponent(searchParams.n) : null;
  const isVip  = searchParams.t === "vip";
  const cardId = searchParams.card;

  const ogImage = cardId ? cardImageUrl(cardId) : null;

  const title = name
    ? `${name} is attending KHINEXT '26${isVip ? " as a VIP Delegate" : ""}`
    : "KHINEXT '26 — Attendance Card";

  const description = name
    ? `Join ${name} at Asia's First Multi Domain AI and Innovation Summit — June 7, 2026, PC Hotel Karachi.`
    : "Asia's First Multi Domain AI and Innovation Summit — June 7, 2026, PC Hotel Karachi.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/card-view${cardId ? `?card=${cardId}` : ""}`,
      ...(ogImage
        ? { images: [{ url: ogImage, width: 1080, height: 1080, alt: title }] }
        : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default function CardViewPage({
  searchParams,
}: {
  searchParams: { card?: string; t?: string; n?: string; d?: string };
}) {
  const cardId = searchParams.card;
  const name   = searchParams.n ? decodeURIComponent(searchParams.n) : null;
  const isVip  = searchParams.t === "vip";

  const imgUrl = cardId ? cardImageUrl(cardId) : null;

  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center px-6 py-14 md:py-20">

      {/* Top label */}
      <p className="kx-eyebrow mb-4">KHINEXT &apos;26</p>

      {/* Title */}
      <h1 className="font-display font-extrabold text-white text-3xl md:text-4xl -tracking-tight text-center mb-10">
        {name ? (
          <>
            {name}&rsquo;s{" "}
            <span className={isVip ? "text-[#FFB800]" : "kx-accent"}>
              {isVip ? "VIP Delegate" : "Attendance"} Card
            </span>
          </>
        ) : (
          <>
            <span className="kx-accent">Attendance Card</span>
          </>
        )}
      </h1>

      {/* Card image */}
      {imgUrl ? (
        <div className="w-full max-w-[420px] mx-auto rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl}
            alt={name ? `${name}'s KHINEXT '26 attendance card` : "KHINEXT '26 attendance card"}
            className="w-full h-auto block"
            fetchPriority="high"
          />
        </div>
      ) : (
        <div className="w-full max-w-[420px] mx-auto rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center h-64 mb-10">
          <p className="text-white/35 text-sm">Card not found</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col items-center gap-4 w-full max-w-[320px]">
        {imgUrl && (
          <a
            href={imgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="kx-btn kx-btn-outline w-full justify-center"
          >
            <Download size={16} />
            Save Card
          </a>
        )}

        <Link href="/card-generator" className="kx-btn kx-btn-primary w-full justify-center">
          Create Your Own Card
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Footer note */}
      <p className="mt-10 text-xs text-white/25 text-center max-w-xs">
        Asia&apos;s First Multi Domain AI Summit &middot; June 7, 2026 &middot; PC Hotel, Karachi
      </p>
    </main>
  );
}
