import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Footer from "@/features/navigation/components/Footer";
import KoraCircle from "@/features/kora/components/KoraCircle";
import { Parallax, Rise } from "@/components/anim";
import { Label, TextLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Boudha — Lingkor",
  description:
    "Boudhanath, the kora, and the neighbourhood the hotel sits in — a short walk from the stupa.",
};

const NEARBY = [
  {
    name: "The stupa",
    line: "One of the largest in the world, and lit after dark. The kora runs around its base.",
  },
  {
    name: "The monasteries",
    line: "Several in the surrounding streets, a number of them open to visitors during the day.",
  },
  {
    name: "The market",
    line: "Built around pilgrimage: prayer flags, butter lamps, incense, thangka painters.",
  },
  {
    name: "Kathmandu",
    line: "Thamel and Durbar Square are a taxi ride across town, mostly along the ring road.",
  },
];

export default function BoudhaPage() {
  return (
    <main className="w-full">
      <PageHeader
        label="Where it stands"
        lines={["Inside", "the circle"]}
        intro="Boudha sits on the north-east edge of Kathmandu, gathered around the stupa. The hotel is a short walk from the dome, inside the circuit people have walked for centuries."
      />

      <section className="w-full bg-canvas pb-24 lg:pb-32">
        <div className="mx-auto w-full shell-max shell-px">
          <Parallax
            src="/images/boudhanath.webp"
            alt="Boudhanath stupa"
            sizes="100vw"
            className="aspect-[16/9] w-full"
          />
        </div>
      </section>

      {/* The kora, drawn as the circle it is. Owns its own <section>. */}
      <KoraCircle />

      <section className="w-full bg-sand py-28 lg:py-40">
        <div className="mx-auto w-full shell-max shell-px">
          <Rise>
            <Label className="opacity-60">A few steps away</Label>
          </Rise>

          <dl className="mt-14 border-t border-ink/15">
            {NEARBY.map((n, i) => (
              <Rise as="div" key={n.name} delay={i * 80}>
                <div className="flex flex-col gap-2 border-b border-ink/15 py-7 sm:flex-row sm:gap-12">
                  <dt className="sm:w-56 sm:shrink-0">
                    <span className="font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-none">
                      {n.name}
                    </span>
                  </dt>
                  <dd className="text-body opacity-75">{n.line}</dd>
                </div>
              </Rise>
            ))}
          </dl>

          <Rise delay={220} className="mt-16">
            <TextLink href="/contact">Ask how to reach us</TextLink>
          </Rise>
        </div>
      </section>

      <Footer />
    </main>
  );
}
