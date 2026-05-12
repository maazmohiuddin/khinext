import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SubmitForm } from "./SubmitForm";

export const metadata: Metadata = {
  title: "Submit your AI project — Khinext '26 AI Expo",
  description: "Open to individuals, student teams and companies. Top 50 selected entries get a live demo booth at Khinext '26.",
};

export default function SubmitPage() {
  return (
    <>
      <PageHero eyebrow="AI Expo Submissions" title={<>Submit Your <span className="kx-accent">Project</span></>}>
        Open to individuals, student teams and companies. The top 50 selected entries get a live demo booth at the event. Applications close 45 days before Khinext '26.
      </PageHero>
      <section className="kx-section" aria-labelledby="submit-form-title">
        <h2 id="submit-form-title" className="sr-only">Submission form</h2>
        <SubmitForm />
      </section>
    </>
  );
}
