import type { Metadata } from "next";
import { Showcase } from "./Showcase";

export const metadata: Metadata = {
  title: "Khinext '26 — UX Case Study",
  description:
    "A technical UX case study of the Khinext '26 platform: idea → problem → decision, personas, task-flow architecture, and the what & why behind every design choice.",
  openGraph: {
    title: "Khinext '26 — UX Case Study",
    description:
      "Idea → problem → decision, personas, task-flow diagrams and the reasoning behind a realtime event platform.",
    type: "article",
  },
};

export default function ShowcasePage() {
  return <Showcase />;
}
