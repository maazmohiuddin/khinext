import { Hero } from "@/components/sections/Hero";
import { EventDates } from "@/components/sections/EventDates";
import { Stats } from "@/components/sections/Stats";
import { Domains } from "@/components/sections/Domains";
import { Partners } from "@/components/sections/Partners";
import { Testimonials } from "@/components/sections/Testimonials";
import { RegisterCTA } from "@/components/sections/RegisterCTA";
import { getApprovedTestimonials } from "@/lib/testimonials";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const testimonials = await getApprovedTestimonials(24);

  return (
    <>
      <Hero />
      <EventDates />
      <Stats />
      <Domains />
      <div id="partners">
        <Partners />
      </div>
      {testimonials.length > 0 && (
        <div id="testimonials">
          <Testimonials items={testimonials} />
        </div>
      )}
      <RegisterCTA />
    </>
  );
}
