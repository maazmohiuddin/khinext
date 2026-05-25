import type { Metadata } from "next";
import { CardGenerator } from "./CardGenerator";

export const metadata: Metadata = {
  title: "Digital Attendance Card — Khinext '26",
  description: "Create and share your personalised KHINEXT '26 attendance card. Standard and VIP Delegate templates with instant download.",
  openGraph: {
    title: "Create Your KHINEXT '26 Digital Card",
    description: "Asia's First Multi Domain AI and Innovation Summit — June 7, 2026, PC Hotel Karachi.",
  },
};

export default function CardGeneratorPage() {
  return <CardGenerator />;
}
