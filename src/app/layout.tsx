import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { Preloader } from "@/components/layout/Preloader";

export const metadata: Metadata = {
  title: "Khinext '26 — Pakistan's First Multi-Domain AI Summit",
  description:
    "Khinext '26 — AI Expo + Gaming Arena. Karachi, Pakistan. 10,000+ attendees, 100+ speakers, 7 innovation domains. Two days that will define South Asia's tech decade.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Khinext '26 — Pakistan's First Multi-Domain AI Summit",
    description: "AI Expo + Gaming Arena, Karachi 2026.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#040B1C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Preloader />
        <Nav />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
