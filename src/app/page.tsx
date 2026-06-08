import { Hero } from "@/components/sections/Hero";
import { EventDates } from "@/components/sections/EventDates";
import { Stats } from "@/components/sections/Stats";
import { Domains } from "@/components/sections/Domains";
import { Partners } from "@/components/sections/Partners";
import { RegisterCTA } from "@/components/sections/RegisterCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <EventDates />
      <Stats />
      <Domains />
      <div id="partners">
        <Partners />
      </div>
      <RegisterCTA />
    </>
  );
}
