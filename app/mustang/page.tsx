import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Footer from "@/features/navigation/components/Footer";
import { Parallax, RevealParagraph, Rise } from "@/components/anim";
import { Label, TextLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Mustang — Lingkor",
  description:
    "The high desert behind the Annapurnas: Lo Manthang, the Kali Gandaki, and the country the caravans came down from.",
};

const BODY =
  "Behind the Annapurnas the rain stops. What is left is a high desert the colour of rust and bone, where the wind has been shaping the cliffs for longer than anyone has counted, and every wall, every pigment, every carved stone came out of the ground it stands on. Prayer flags mark the passes. Chörtens mark the crossings. This is the country the caravans came down from, and the country this hotel is built out of.";

const PLACES = [
  {
    name: "Lo Manthang",
    note: "The walled capital",
    image: "/images/extras/Lomanthang2.webp",
    line: "Still behind its old walls, at nearly 3,840 m — the seat of the Kingdom of Lo and the end of the road north.",
  },
  {
    name: "Kali Gandaki",
    note: "The canyon road",
    image: "/images/essay/essay-06.webp",
    line: "The gorge between Dhaulagiri and Annapurna, and the reason a trade route existed here at all.",
  },
  {
    name: "Muktinath",
    note: "The pilgrim's turn",
    image: "/images/extras/Muktinath.webp",
    line: "Sacred to Hindus and Buddhists both, and for centuries a stop on the way down.",
  },
  {
    name: "Luri",
    note: "Painted into the cliff",
    image: "/images/extras/Lomanthang3.webp",
    line: "A cave gompa carved into rock, its dome painted since the 13th century. The rooftop café takes its name.",
  },
];

export default function MustangPage() {
  return (
    <main className="w-full">
      <PageHeader
        tone="ink"
        label="The country it comes from"
        lines={["Four hundred", "kilometres north"]}
      />

      <div className="w-full bg-ink text-space">
        <Parallax
          src="/images/extras/Lomanthang.webp"
          alt="Red cliffs above the valley floor, Upper Mustang"
          className="h-[70svh] w-full"
          strength={10}
        />

        <section className="mx-auto w-full shell-max shell-px py-28 lg:py-40">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <RevealParagraph
                text={BODY}
                className="text-[clamp(1.25rem,2.1vw,1.875rem)] leading-[1.55]"
              />
            </div>
            <dl className="lg:col-span-4 lg:col-start-9 lg:self-end">
              {[
                { term: "Where", detail: "Upper Mustang, along the Kali Gandaki" },
                { term: "Altitude", detail: "Lo Manthang sits near 3,840 m" },
                { term: "The road down", detail: "Kagbeni, Jomsom, Thak Khola" },
              ].map((f, i) => (
                <Rise as="div" key={f.term} delay={i * 90}>
                  <div className="border-t border-space/20 py-5">
                    <dt>
                      <Label className="opacity-40">{f.term}</Label>
                    </dt>
                    <dd className="text-body mt-2 opacity-80">{f.detail}</dd>
                  </div>
                </Rise>
              ))}
            </dl>
          </div>
        </section>

        {/* Places, at real scale — this is the page where showing them is the point,
            unlike the homepage where the brief asks us to withhold. */}
        <section className="mx-auto w-full shell-max shell-px pb-32 lg:pb-44">
          <Rise>
            <Label className="opacity-50">On the road</Label>
          </Rise>

          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2">
            {PLACES.map((p, i) => (
              <Rise key={p.name} delay={(i % 2) * 90}>
                <article>
                  <Parallax
                    src={p.image}
                    alt={p.name}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="aspect-[3/2] w-full"
                    strength={8}
                  />
                  <div className="mt-6 border-t border-space/20 pt-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="font-display text-[clamp(1.75rem,2.6vw,2.25rem)] leading-none">
                        {p.name}
                      </h2>
                      <Label className="shrink-0 opacity-40">{p.note}</Label>
                    </div>
                    <p className="text-body mt-4 opacity-70">{p.line}</p>
                  </div>
                </article>
              </Rise>
            ))}
          </div>

          <Rise delay={200} className="mt-20">
            <TextLink href="/about" className="text-space">
              How the road ended at Boudha
            </TextLink>
          </Rise>
        </section>
      </div>

      <Footer />
    </main>
  );
}
