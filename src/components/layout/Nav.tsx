"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";

type NavLink = { label: string; href: string; children?: NavLink[] };

const LINKS: NavLink[] = [
  { label: "Home",     href: "/" },
  {
    label: "Tracks",   href: "#",
    children: [
      { label: "AI Expo", href: "/ai-expo" },
      { label: "Gaming",  href: "/gaming"  },
    ],
  },
  { label: "My Card",  href: "/card-generator" },
  { label: "Submit",   href: "/submit" },
  { label: "Testimonials", href: "/testimonials" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [tracksOpen, setTracksOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); setTracksOpen(false); }, [pathname]);

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
          <span className="relative block h-9 md:h-10 transition-transform duration-300 ease-soft group-hover:scale-[1.04]">
            <Image
              src="/brand/logo.png"
              alt=""
              width={520}
              height={140}
              priority
              className="h-full w-auto block drop-shadow-[0_4px_18px_rgba(49,107,255,0.45)]"
            />
          </span>
          <span className="sr-only">Khinext &apos;26</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-7">
          {LINKS.map(l => {
            const isActive =
              (l.href !== "#" && (pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href)))) ||
              (l.children && l.children.some(c => pathname.startsWith(c.href)));
            if (l.children) {
              return (
                <li
                  key={l.label}
                  className="relative"
                  onMouseEnter={() => setTracksOpen(true)}
                  onMouseLeave={() => setTracksOpen(false)}
                >
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={tracksOpen}
                    onClick={() => setTracksOpen(o => !o)}
                    className={`inline-flex items-center gap-1 text-sm transition-colors duration-200 ease-soft hover:text-white ${
                      isActive ? "text-white" : "text-white/45"
                    }`}
                  >
                    {l.label}
                    <ChevronDown size={13} aria-hidden="true" className={`transition-transform duration-200 ${tracksOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {tracksOpen && (
                      <motion.div
                        role="menu"
                        aria-label="Tracks"
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50"
                        initial={{ opacity: 0, y: -6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <ul className="rounded-2xl bg-khi-ink/95 backdrop-blur-xl border border-white/10 p-1.5 min-w-[180px] shadow-2xl">
                          {l.children.map(c => (
                            <motion.li
                              key={c.href}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <Link
                                href={c.href}
                                role="menuitem"
                                className={`block px-4 py-2.5 rounded-xl text-sm transition-colors duration-200 ease-soft ${
                                  pathname.startsWith(c.href)
                                    ? "bg-khi-blue/15 text-khi-blue-soft"
                                    : "text-white/70 hover:bg-white/5 hover:text-white"
                                }`}
                              >
                                {c.label}
                              </Link>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            }
            const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`group relative text-sm transition-colors duration-200 ease-soft hover:text-white ${
                    active ? "text-white" : "text-white/45"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {l.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-underline"
                      aria-hidden="true"
                      className="absolute left-0 -bottom-1.5 h-[1px] w-full"
                      style={{ background: "linear-gradient(90deg, #4579FF, transparent)" }}
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 -bottom-1.5 h-[1px] w-0 group-hover:w-1/2 transition-[width] duration-300 ease-soft"
                      style={{ background: "linear-gradient(90deg, #4579FF, transparent)" }}
                    />
                  )}
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
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            id="mobile-nav"
            className="md:hidden fixed inset-x-0 top-[72px] bottom-0 bg-khi-ink/95 backdrop-blur-2xl z-40 overflow-y-auto"
            role="dialog"
            aria-label="Mobile navigation"
          >
            <motion.ul
              className="flex flex-col gap-1 p-6"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } } }}
              initial="hidden"
              animate="show"
            >
              <MobileLink href="/" label="Home" />
              <motion.li variants={mobileItem} className="mt-2 mb-1 px-1 text-[10px] font-bold uppercase text-white/30" style={{ letterSpacing: "0.22em" }}>Tracks</motion.li>
              <MobileLink href="/ai-expo" label="AI Expo" indented />
              <MobileLink href="/gaming"  label="Gaming"  indented />
              <motion.li variants={mobileItem} className="mt-1" />
              <MobileLink href="/card-generator" label="My Card" />
              <MobileLink href="/submit" label="Submit" />
              <MobileLink href="/testimonials" label="Testimonials" />
              <motion.li variants={mobileItem} className="mt-4">
                <Link href="/register" className="kx-btn-primary w-full justify-center">
                  Register Now
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

const mobileItem = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

function MobileLink({ href, label, indented }: { href: string; label: string; indented?: boolean }) {
  return (
    <motion.li variants={mobileItem}>
      <Link
        href={href}
        className={`block py-3 ${indented ? "pl-4" : ""} text-xl font-display font-bold text-white/80 hover:text-white transition-colors`}
      >
        {label}
      </Link>
    </motion.li>
  );
}
