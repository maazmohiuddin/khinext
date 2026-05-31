import { Reveal } from "@/components/ui/Reveal";
import { CalendarDays, MapPin, Ticket, Users } from "lucide-react";

const DATES = [
  { icon: CalendarDays, label: "Date",     value: "Sun · 7 June 2026" },
  { icon: MapPin,       label: "Venue",    value: "Karachi, Pakistan" },
  { icon: Users,        label: "Capacity", value: "10,000+ attendees" },
  { icon: Ticket,       label: "Tracks",   value: "AI Expo + Gaming" },
] as const;

export function EventDates() {
  return (
    <section
      aria-labelledby="event-dates"
      className="border-t border-b border-white/10 bg-white/[0.012]"
    >
      <div className="max-w-page mx-auto px-6 md:px-14 py-10 md:py-12">
        <Reveal>
          <h2 id="event-dates" className="sr-only">Event details</h2>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/10">
            {DATES.map(({ icon: Icon, label, value }) => (
              <li
                key={label}
                className="bg-khi-ink p-6 md:p-7 flex flex-col gap-3 group transition-colors duration-300 ease-soft hover:bg-white/[0.02]"
              >
                <Icon size={18} className="text-khi-blue transition-transform duration-300 ease-soft group-hover:scale-110 group-hover:-rotate-3" aria-hidden="true" />
                <div className="text-[10px] md:text-[11px] font-bold uppercase text-white/30" style={{ letterSpacing: "0.18em" }}>
                  {label}
                </div>
                <div className="font-display text-base md:text-lg font-bold text-white -tracking-wider">
                  {value}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
