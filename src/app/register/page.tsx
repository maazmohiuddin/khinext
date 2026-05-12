import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Register for Khinext '26 — Karachi, March 2026",
  description: "Free registration for Pakistan's first multi-domain AI Summit. AI Expo + Gaming Arena at Karachi.",
};

export default function RegisterPage() {
  return (
    <>
      <PageHero eyebrow="Khinext '26" title={<>Register for the <span className="kx-accent">Event</span></>}>
        Secure your place at Pakistan's first multi-domain AI Summit. Select your track, tell us who you are, and we'll handle the rest.
      </PageHero>
      <section className="kx-section" aria-labelledby="register-form-title">
        <h2 id="register-form-title" className="sr-only">Registration form</h2>
        <RegisterForm />
      </section>
    </>
  );
}
