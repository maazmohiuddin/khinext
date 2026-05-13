import { Hero } from "@/components/sections/Hero";
import { Countdown } from "@/components/sections/Countdown";
import { EventDates } from "@/components/sections/EventDates";
import { Stats } from "@/components/sections/Stats";
import { Domains } from "@/components/sections/Domains";
import { Sponsors } from "@/components/sections/Sponsors";
import { RegisterCTA } from "@/components/sections/RegisterCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Countdown />
      <EventDates />
      <Stats />
      <Domains />
      <Sponsors />
      <RegisterCTA />
    </>
  );
}
