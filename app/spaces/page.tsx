import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Footer from "@/features/navigation/components/Footer";
import { Rise } from "@/components/anim";
import { Label } from "@/components/ui";
import { AREAS, blendsWithGround } from "@/lib/site";
import { LineArt, Photo } from "@/components/media/Photo";

export const metadata: Metadata = {
  title: "The seven spaces — Lingkor",
  description:
    "Netsang, Menthang, Ghegu, Luri and Namkha — five Tibetan elements — plus the Mustang Inn and the Lingkor Boutique.",
};

export default function SpacesPage() {
  return (
    <main className="w-full">
      <PageHeader
        label="The seven spaces"
        lines={["Five elements,", "and two more"]}
        intro="The hotel is laid out as a circuit. Five rooms carry one Tibetan element each — its colour, its name, and the piece of Mustang it is named for. Two more carry no colour at all."
      />

      {/* Full-bleed bands, one per element. No two colours share a viewport, which is
          the whole reason this is a stack and not a grid. */}
      <div className="w-full">
        {AREAS.map((space, i) => {
          const white = space.displayOnField === "white";
          const flip = i % 2 === 1;
          return (
            <section
              key={space.slug}
              id={space.slug}
              className={`grid w-full grid-cols-1 lg:grid-cols-2 ${
                // Namkha and the two colourless areas share the page ground, so their
                // bands need a drawn edge or they read as gaps in the list.
                blendsWithGround(space.field) ? "border-y border-ink/12" : ""
              }`}
              style={{
                backgroundColor: space.field,
                color: white ? "var(--color-space)" : "var(--color-ink)",
              }}
            >
              {space.image ? (
                <Rise
                  as="figure"
                  className={`h-[46svh] lg:h-[76svh] ${flip ? "lg:order-2" : ""}`}
                >
                  <Photo
                    src={space.image}
                    alt=""
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    loading={i < 2 ? "eager" : "lazy"}
                    className="h-full w-full"
                  />
                </Rise>
              ) : (
                // No render exists, and the client was unsure these should be shown
                // at all — so the drawing stands in for the photograph.
                <Rise
                  as="figure"
                  className={`flex items-center justify-center py-20 lg:py-0 ${
                    flip ? "lg:order-2" : ""
                  }`}
                >
                  <LineArt
                    name="caravan"
                    tone="terracotta"
                    className="h-[22rem] w-auto opacity-60 lg:h-[30rem]"
                  />
                </Rise>
              )}

              <div
                className={`flex flex-col justify-center px-6 py-16 lg:px-16 lg:py-20 ${
                  flip ? "lg:order-1" : ""
                }`}
              >
                <Rise>
                  <div className="flex items-baseline justify-between">
                    <Label className="opacity-70">{space.role}</Label>
                    <Label className="opacity-70">
                      {String(i + 1).padStart(2, "0")} / 07
                    </Label>
                  </div>
                </Rise>

                <Rise delay={100}>
                  <h2 className="font-display mt-6 text-[clamp(2.5rem,5vw,4.5rem)] leading-none">
                    {space.name}
                  </h2>
                </Rise>

                <Rise delay={180}>
                  <p className="text-body mt-8 max-w-[44ch]">{space.line}</p>
                </Rise>

                <Rise delay={260}>
                  <Label className="mt-10 block opacity-60">
                    {space.element ? `${space.element} · ${space.hue}` : space.hue}
                  </Label>
                </Rise>

                <Rise delay={340}>
                  <Link
                    href={`/spaces/${space.slug}`}
                    className="text-label mt-10 inline-block uppercase underline decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-transparent"
                  >
                    More about {space.name}
                  </Link>
                </Rise>
              </div>
            </section>
          );
        })}
      </div>

      <Footer />
    </main>
  );
}
