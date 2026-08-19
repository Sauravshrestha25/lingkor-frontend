import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Footer from "@/features/navigation/components/Footer";
import { Parallax, Rise } from "@/components/anim";
import { Label, TextLink } from "@/components/ui";
import { ROOMS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rooms — Lingkor",
  description:
    "Rooms and suites at Lingkor, Boudha — hand-woven runners, painted clouds, and windows that hold the stupa.",
};

export default function RoomsPage() {
  return (
    <main className="w-full">
      <PageHeader
        label="Rooms"
        lines={["Somewhere", "to put the day"]}
        intro="Each room carries a piece of Mustang: hand-woven runners, clouds painted on the cabinets, and windows that hold the stupa."
      />

      {/* A real index rather than a carousel — this is the page you come to when you
          actually want to compare rooms, so every one is visible at once. */}
      <section className="w-full bg-canvas pb-28 lg:pb-40">
        <div className="mx-auto w-full shell-max shell-px">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {ROOMS.map((room, i) => (
              <Rise key={room.id} delay={(i % 3) * 90}>
                <article className="group">
                  <Parallax
                    src={`/images/rooms/${room.id}.webp`}
                    alt={`${room.name} — ${room.note}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="aspect-4/5 w-full"
                    strength={6}
                  />
                  <div className="mt-6 border-t border-ink/15 pt-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="font-display text-sub">{room.name}</h2>
                      <Label className="shrink-0 opacity-40">{room.size}</Label>
                    </div>
                    <Label className="mt-3 block opacity-50">{room.note}</Label>
                  </div>
                </article>
              </Rise>
            ))}
          </div>

          {/* TODO: rates, exact sizes and bed configurations — none supplied.
              See CONTENT.md. */}
          <Rise delay={200} className="mt-24 border-t border-ink/15 pt-12">
            <p className="text-body max-w-[46ch] opacity-70">
              Rates depend on the season and the length of the stay. Write to us
              with your dates and we will send them.
            </p>
            <div className="mt-8">
              <TextLink href="/contact">Ask about a room</TextLink>
            </div>
          </Rise>
        </div>
      </section>

      <Footer />
    </main>
  );
}
