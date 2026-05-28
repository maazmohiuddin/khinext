import type { Metadata } from "next";
import { CardGenerator } from "./CardGenerator";

export const metadata: Metadata = {
  title: "Create Your KHINEXT '26 Digital Card",
  description:
    "Personalise your KHINEXT '26 attendance card and share it on LinkedIn, Instagram, and Facebook.",
};

export default function CardGeneratorPage() {
  return <CardGenerator />;
}
