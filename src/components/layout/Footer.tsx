import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer
      className="border-t border-white/10 bg-white/[0.012]"
      role="contentinfo"
    >
      <div className="max-w-page mx-auto px-6 md:px-14 py-12 grid md:grid-cols-3 gap-8 items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/brand/Khinext1.png"
            alt="Khinext"
            width={32}
            height={32}
            style={{ borderRadius: 8 }}
          />
          <span className="font-display text-lg font-bold tracking-tight">
            Khi<em className="text-khi-blue font-extrabold">next</em>
          </span>
        </div>
        <p className="text-center text-sm text-white/45 leading-relaxed">
          <em className="text-khi-blue-bright not-italic font-bold" style={{ fontStyle: "italic" }}>KHINEXT '26</em> — Pakistan's first multi-domain AI Summit.<br />
          Karachi · 7 June 2026 · <span className="text-white/30">INNOVATE · INSPIRE · IMPACT</span>
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 justify-center md:justify-end text-sm">
          <li><Link href="/ai-expo" className="text-white/45 hover:text-khi-blue-bright transition-colors">AI Expo</Link></li>
          <li><Link href="/gaming" className="text-white/45 hover:text-khi-blue-bright transition-colors">Gaming</Link></li>
          <li><Link href="/submit" className="text-white/45 hover:text-khi-blue-bright transition-colors">Submit</Link></li>
          <li><Link href="/register" className="text-white/45 hover:text-khi-blue-bright transition-colors">Register</Link></li>
          <li><Link href="/admin" className="text-white/45 hover:text-khi-blue-bright transition-colors">Admin</Link></li>
        </ul>
      </div>
    </footer>
  );
}
