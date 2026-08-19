import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/features/navigation/components/Footer";
import { Rise, SplitChars } from "@/components/anim";
import { CloudMotif } from "@/components/media/CloudMotif";
import { Photo } from "@/components/media/Photo";
import { SpaceFeatures } from "@/features/spaces/components/SpaceFeatures";
import { Label } from "@/components/ui";
import { AREAS, spaceBySlug } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

/** Pre-render all seven at build time; there will never be an eighth at runtime. */
export function generateStaticParams() {
  return AREAS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const space = spaceBySlug(slug);
  if (!space) return { title: "Not found — Lingkor" };
  return {
    title: `${space.name} — ${space.role} — Lingkor`,
    description: space.line,
  };
}

/**
 * A space, in the shape Forestis gives its Spa and Suites pages — but on this site's
 * own type scale and with its own rhythm.
 *
 * Three things changed from the first attempt:
 *
 * 1. **The motto is in the hero.** It had a whole coloured section to itself, which
 *    meant the page opened by saying the name, then immediately stopped to say what
 *    the name means. Two openings in a row. It belongs *with* the name.
 * 2. **The type is the homepage's.** This page had drifted onto its own scale —
 *    `clamp(3.5rem,10vw,9rem)` against the homepage hero's `clamp(2.75rem,7.5vw,7rem)`,
 *    and a `leading-[1.75]` overriding the `--text-body` token's 1.65. Same tokens now.
 * 3. **The blocks are no longer all the same width.** Uniform centred blocks read as a
 *    template however much air sits between them. The lead is offset, the body sits in
 *    a narrow measure, and the photographs alternate between full-bleed and inset — so
 *    the page has a shape rather than a repeating unit.
 */
export default async function SpacePage({ params }: Params) {
  const { slug } = await params;
  const space = spaceBySlug(slug);
  if (!space) notFound();

  const white = space.displayOnField === "white";

  /**
   * The circuit is the five element spaces, matching the menu.
   *
   * Mustang Inn and the Boutique still have pages, but they are not in the menu and
   * they carry no element — so counting them here would print "06 / 07" on a page
   * reached from a five-item list, and would walk a visitor into a space the menu
   * never offered. They sit outside the circuit and point back into it.
   */
  const circuit = AREAS.filter((s) => !s.colourless);
  const index = circuit.findIndex((s) => s.slug === space.slug);
  const inCircuit = index !== -1;
  const next = inCircuit ? circuit[(index + 1) % circuit.length] : circuit[0];

  const [lead, ...rest] = space.body;
  const gallery = space.gallery ?? [];

  return (
    <main className="w-full">
      {/* ── Hero: photograph, name, and what the name means ───────────────── */}
      <header className="relative h-svh w-full overflow-hidden bg-ink">
        {space.image ? (
          <>
            <Photo
              src={space.image}
              alt={`${space.name}, ${space.role}`}
              sizes="100vw"
              preload
              className="absolute inset-0 h-full w-full"
            />
            {/* Bottom-weighted, matching the homepage hero: the type needs ground to
                sit on, and a full scrim would flatten the render. */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/40" />
          </>
        ) : (
          // The two colourless areas have no render on purpose — the flat field does
          // the work the photograph would have done.
          <div className="absolute inset-0" style={{ backgroundColor: space.field }} />
        )}

        {/* Over a photograph the type is always light, because the scrim guarantees a
            dark ground. Over a flat field it has to follow that field: Mustang Inn and
            the Boutique sit on the off-white ground, where light type is invisible. */}
        <div
          className="absolute inset-0 flex flex-col justify-end shell-px pb-[max(2.5rem,env(safe-area-inset-bottom))]"
          style={{ color: space.image || white ? "var(--color-space)" : "var(--color-ink)" }}
        >
          <div className="mx-auto w-full shell-max">
            <Rise>
              <Label className="opacity-70">{space.role}</Label>
            </Rise>

            <SplitChars
              lines={[space.name]}
              delay={140}
              className="font-display mt-6 text-[clamp(2.75rem,7.5vw,7rem)] leading-[0.95]"
            />

            {space.motto && (
              <Rise delay={320} className="mt-6">
                <p className="font-display text-[clamp(1.375rem,3vw,2.5rem)] leading-[1.15] opacity-90">
                  {space.motto}
                </p>
              </Rise>
            )}

            <Rise
              delay={420}
              className="mt-10 flex flex-col gap-4 border-t border-current/20 pt-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <Label className="opacity-70">
                {space.element ? `${space.element} · ${space.hue}` : space.hue}
              </Label>
              {inCircuit && (
                <Label className="opacity-50">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(circuit.length).padStart(2, "0")}
                </Label>
              )}
            </Rise>
          </div>
        </div>
      </header>

      {/* ── The lead, offset, with the name taken apart beside it ──────────── */}
      <section className="w-full bg-canvas py-28 lg:py-40">
        <div className="mx-auto w-full shell-max shell-px">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <Rise className="lg:col-span-7">
              {/* A step above body, not a different register. At the old
                  `clamp(1.25rem,2.1vw,1.875rem)` this ran 1.76x the body size at
                  desktop, which read as two unrelated blocks rather than a lead and
                  its continuation. This holds ~1.3x at every width. */}
              <p className="text-[clamp(1.125rem,1.6vw,1.5rem)] leading-[1.5]">
                {lead}
              </p>
            </Rise>

            {space.etymology && (
              <Rise delay={140} className="lg:col-span-4 lg:col-start-9">
                {/* A definition list because that is what it is — term and gloss —
                    and it lets a screen reader announce the pairing. */}
                <dl>
                  {space.etymology.map((e) => (
                    <div key={e.term} className="border-t border-ink/15 py-5">
                      <dt className="font-display text-[1.5rem] leading-none">
                        {e.term}
                      </dt>
                      <dd className="text-body mt-2 opacity-70">{e.gloss}</dd>
                    </div>
                  ))}
                </dl>
              </Rise>
            )}
          </div>
        </div>
      </section>

      {/* ── First photograph, full-bleed and held ──────────────────────────── */}
      {gallery[0] && (
        <Photo
          src={gallery[0]}
          alt={`${space.name} — ${space.role}`}
          sizes="100vw"
          className="h-[70svh] w-full"
        />
      )}

      {/* ── The feature run, pinned ────────────────────────────────────────
          Only where there are enough photographs — see `Space.features`. */}
      {space.features && (
        <SpaceFeatures features={space.features} name={space.name} />
      )}

      {/* ── The rest of the story, in a narrow measure ─────────────────────── */}
      {rest.length > 0 && (
        <section className="w-full bg-canvas py-28 lg:py-40">
          <div className="mx-auto w-full shell-max shell-px">
            {rest.map((para, i) => {
              const img = gallery[i + 1];
              return (
                <div key={i} className={i > 0 ? "mt-24 lg:mt-36" : ""}>
                  {/* Alternating margin, so the column walks down the page rather
                      than sitting in one dead-centred stack. */}
                  <Rise
                    className={
                      i % 2 === 0
                        ? "lg:ml-[8%] lg:mr-auto"
                        : "lg:ml-auto lg:mr-[8%]"
                    }
                  >
                    <p className="text-body max-w-[58ch]">{para}</p>
                  </Rise>

                  {img && (
                    <Rise delay={120} className="mt-20 lg:mt-28">
                      {/* Inset, and offset to the opposite side from the paragraph
                          above it — the alternation is what stops the page reading
                          as one repeating unit. */}
                      <Photo
                        src={img}
                        alt={`${space.name} — ${space.role}`}
                        sizes="(max-width: 1024px) 100vw, 76vw"
                        className={`aspect-[16/9] w-full lg:w-[76%] ${
                          i % 2 === 0 ? "lg:ml-auto" : "lg:mr-auto"
                        }`}
                      />
                    </Rise>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Any photographs the paragraphs did not consume ─────────────────── */}
      {gallery.length > rest.length + 1 && (
        <section className="w-full bg-canvas pb-28 lg:pb-40">
          <div className="mx-auto w-full shell-max shell-px">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {gallery.slice(rest.length + 1).map((src, i) => (
                <Rise key={src} delay={i * 90}>
                  <Photo
                    src={src}
                    alt={`${space.name} — ${space.role}`}
                    sizes="(max-width: 640px) 100vw, 46vw"
                    className="aspect-[4/3] w-full"
                  />
                </Rise>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Next space — a circuit, so the last one leads back to the first ── */}
      <section
        className="relative w-full overflow-hidden py-24 lg:py-32"
        style={{
          backgroundColor: next.field,
          color: next.displayOnField === "white" ? "var(--color-space)" : "var(--color-ink)",
        }}
      >
        <CloudMotif className="pointer-events-none absolute -right-12 -top-6 w-56 opacity-15 lg:w-80" />
        <div className="relative mx-auto w-full shell-max shell-px">
          <Rise>
            <Label className="opacity-70">Next</Label>
            <Link
              href={`/spaces/${next.slug}`}
              className="group mt-6 flex items-baseline justify-between gap-6"
            >
              <span className="font-display text-[clamp(2rem,5.5vw,5rem)] leading-[0.98] transition-transform duration-700 ease-out group-hover:translate-x-3">
                {next.name}
              </span>
              <Label className="shrink-0 opacity-70">{next.role}</Label>
            </Link>
          </Rise>
        </div>
      </section>

      <Footer />
    </main>
  );
}
