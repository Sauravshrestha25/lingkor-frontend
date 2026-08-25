import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Footer from "@/features/navigation/components/Footer";
import { Parallax, RevealParagraph, Rise } from "@/components/anim";
import { Label, TextLink } from "@/components/ui";
import { LineArt } from "@/components/media/Photo";

export const metadata: Metadata = {
  title: "The house — Lingkor",
  description:
    "Lingkor means the circuit walked around a sacred place. The hotel takes its name from the road that ended at Boudhanath.",
};

const NAME =
  "Lingkor is a Tibetan word for the circumambulation of a sacred enclosure — both the pilgrimage route itself and the act of walking it. Around a monastery, a mountain, a stupa, or an entire city. At Boudhanath it is the circle that forms twice a day around the dome, and the hotel sits inside it.";

const STORY = [
  "Long before the roads and the jeeps, a trade route wound through the Himalayas from the high valleys of Mustang down to the courtyards of Kathmandu.",
  "Each autumn, when the winds turned sharp and dry, traders from Lo gathered their caravans of yaks and mules. From Tibet they carried blocks of salt, white and glimmering. From their own homeland, barley — the golden grain that saw them through the winter.",
  "They came down along the Kali Gandaki, through Kagbeni, Jomsom and Thak Khola, on trails older than memory. At every pass, prayer flags. At every stage, the sound of bells keeping the rhythm of the walk.",
  "When they reached Boudha the great stupa stood waiting, a white dome shimmering with incense smoke and sunlight. In the courtyards below they traded salt and barley for wool from the southern hills, and as winter came on they climbed back toward the plateau, the yaks now carrying warmth homeward.",
];

export default function AboutPage() {
  return (
    <main className="w-full">
      <PageHeader
        label="The house"
        lines={["A caravan's", "last stop"]}
        intro="The hotel is named for the walk around the stupa, and built out of the country the walk once started from."
      />

      <section className="w-full bg-canvas pb-28 lg:pb-36">
        <div className="mx-auto w-full shell-max shell-px">
          <Parallax
            src="/images/spaces/exterior.webp"
            alt="Lingkor from above, Boudha"
            sizes="100vw"
            className="aspect-[16/9] w-full"
          />
        </div>
      </section>

      {/* The name */}
      <section className="w-full bg-sand py-28 lg:py-40">
        <div className="mx-auto w-full shell-max shell-px">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Rise>
                <Label className="opacity-60">The name</Label>
              </Rise>
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <RevealParagraph
                text={NAME}
                className="text-[clamp(1.25rem,2.1vw,1.875rem)] leading-[1.55]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The road */}
      <section className="w-full bg-canvas py-28 lg:py-40">
        <div className="mx-auto w-full shell-max shell-px">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Rise>
                <Label className="opacity-60">The road</Label>
              </Rise>
              <LineArt
                name="caravan"
                tone="terracotta"
                className="mt-10 hidden h-[24rem] w-auto lg:block"
              />
            </div>

            <div className="space-y-8 lg:col-span-7 lg:col-start-5">
              {STORY.map((para, i) => (
                <Rise key={i} delay={i * 60}>
                  <p className="text-body max-w-[58ch]">{para}</p>
                </Rise>
              ))}

              <Rise delay={300} className="pt-6">
                <p className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight">
                  Lingkor is where that road rests.
                </p>
              </Rise>
            </div>
          </div>
        </div>
      </section>

      {/* Two rooms with no element colour */}
      <section className="w-full bg-canvas pb-28 lg:pb-40">
        <div className="mx-auto w-full shell-max shell-px">
          <Rise>
            <Label className="opacity-60">Two more rooms</Label>
          </Rise>
          <div className="mt-12 grid grid-cols-1 gap-12 border-t border-ink/15 pt-12 lg:grid-cols-2 lg:gap-20">
            <Rise>
              <h2 className="font-display text-section">Mustang Inn</h2>
              <Label className="mt-4 block opacity-50">The welcome room</Label>
              <p className="text-body mt-6 max-w-[40ch] opacity-80">
                In the front building, in traditional Mustangi style: butter tea
                and chang for anyone just off the road, the way the caravans
                were met.
              </p>
            </Rise>
            <Rise delay={140}>
              <h2 className="font-display text-section">Lingkor Boutique</h2>
              <Label className="mt-4 block opacity-50">The shop</Label>
              <p className="text-body mt-6 max-w-[40ch] opacity-80">
                Weaving, wool and the crafts of Lo — the goods that came down
                this road in the first place.
              </p>
            </Rise>
          </div>

          <Rise delay={200} className="mt-16">
            <TextLink href="/spaces">See the five spaces</TextLink>
          </Rise>
        </div>
      </section>

      <Footer />
    </main>
  );
}
