import { LineArt } from "@/components/media/Photo";
import { RevealParagraph, Rise } from "@/components/anim";
import { Label } from "@/components/ui";
import { JOURNEY } from "../data/copy";

export function JourneyDivider() {
  return (
    <section
      id="journey"
      className="home-knot-gutters relative min-h-screen w-full overflow-hidden py-20 bg-netsang"
    >
      <div className="relative z-10 mx-auto w-full pt-6 shell-max shell-px md:pt-8">
        <div className="flex w-full flex-col items-center text-center">
          <Rise>
            <Label className="text-2xl font-sub font-black uppercase ">
              The journey
            </Label>
          </Rise>
          <RevealParagraph
            text={JOURNEY}
            className="text-body  mt-6 max-w-[58ch]"
          />

          <Rise delay={200} className="mt-16">
            <p className="font-display text-sub">
              Lingkor is where that road rests.
            </p>
          </Rise>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-10 left-[calc(var(--shell-gutter)*2)] right-[calc(var(--shell-gutter)*2)] z-0">
        <LineArt
          name="panorama"
          tone="terracotta"
          className="h-auto w-full opacity-60"
        />
      </div>
    </section>
  );
}
