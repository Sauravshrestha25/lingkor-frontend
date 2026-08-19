import { LineArt } from "@/components/media/Photo";
import { RevealParagraph, Rise } from "@/components/anim";
import { Label } from "@/components/ui";
import { JOURNEY } from "../data/copy";

export function JourneyDivider() {
  return (
    <section
      id="journey"
      className="relative min-h-screen w-full overflow-hidden bg-canvas"
    >
      <div className="relative z-10 mx-auto w-full pt-6 shell-max shell-px md:pt-8">
        <div className="flex w-full flex-col items-center text-center">
          <Rise>
            <Label className="opacity-60">The journey</Label>
          </Rise>
          <RevealParagraph
            text={JOURNEY}
            className="text-lead mt-6 max-w-[58ch]"
          />

          <Rise delay={200} className="mt-6">
            <p className="font-display text-sub">
              Lingkor is where that road rests.
            </p>
          </Rise>
        </div>
      </div>
      <LineArt
        name="panorama"
        tone="terracotta"
        className="pointer-events-none absolute w-full  bottom-20 left-10  z-0  max-w-none opacity-60 lg:w-344"
      />
    </section>
  );
}
