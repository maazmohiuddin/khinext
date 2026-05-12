"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { KxMark } from "@/components/ui/KxMark";

const LINKS = [
  { label: "Home",     href: "/" },
  { label: "Submit",   href: "/submit" },
  { label: "Admin",    href: "/admin" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ease-soft ${
        scrolled ? "backdrop-blur-xl bg-khi-ink/80" : "bg-transparent"
      }`}
      style={{ borderBottom: scrolled ? "1px solid var(--border-default)" : "1px solid transparent" }}
    >
      <nav
        aria-label="Primary"
        className="max-w-page mx-auto flex items-center justify-between px-6 md:px-14 py-4"
      >
        <Link
          href="/"
          aria-label="Khinext '26 home"
          className="group flex items-center gap-3 outline-none"
        >
          <span className="transition-transform duration-300 ease-soft group-hover:-rotate-6 group-hover:scale-105">
            <KxMark size={36} />
          </span>
          <span className="font-display text-[20px] font-bold tracking-tight">
            Khi<em className="text-khi-blue not-italic font-extrabold" style={{ fontStyle: "italic" }}>next</em>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-7">
          {LINKS.map(l => {
            const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative text-sm transition-colors duration-200 ease-soft hover:text-white ${
                    active ? "text-white" : "text-white/45"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {l.label}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 -bottom-1.5 h-[1px] transition-[width] duration-300 ease-soft ${
                      active ? "w-full" : "w-0"
                    }`}
                    style={{ background: "linear-gradient(90deg, #4579FF, transparent)" }}
                  />
                </Link>
              </li>
            );
          })}
          <li>
            <Link href="/register" className="kx-btn-primary !py-2.5 !px-5 !text-[13px]">
              Register Now
            </Link>
          </li>
        </ul>

        {/* Mobile trigger */}
        <button
          type="button"
          className="md:hidden grid place-items-center w-10 h-10 rounded-full border border-white/10 text-white"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile sheet */}
      {open && (
        <div
          id="mobile-nav"
          className="md:hidden fixed inset-x-0 top-[68px] bottom-0 bg-khi-ink/95 backdrop-blur-2xl z-40 animate-in fade-in"
          role="dialog"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1 p-6">
            {LINKS.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block py-4 text-2xl font-display font-bold text-white/80 hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="mt-4">
              <Link href="/register" className="kx-btn-primary w-full justify-center">
                Register Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
