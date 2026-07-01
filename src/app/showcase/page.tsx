import type { Metadata } from "next";
import { Showcase } from "./Showcase";

export const metadata: Metadata = {
  title: "Khinext '26 — Case Study & Product Showcase",
  description:
    "A behind-the-scenes look at the Khinext '26 platform: public event flows, a realtime admin dashboard, and a full communications engine. Design, architecture, and the why behind every feature.",
  openGraph: {
    title: "Khinext '26 — Case Study & Product Showcase",
    description:
      "Public event flows, a realtime admin dashboard, and a full communications engine — the design and engineering behind the Khinext '26 platform.",
    type: "article",
  },
};

export default function ShowcasePage() {
  return <Showcase />;
}
