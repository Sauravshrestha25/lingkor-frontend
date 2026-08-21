import Testimonials from "@/features/testimonials/components/Testimonials";
import { VOICES } from "@/features/testimonials/data/voices";
import { Rise, SplitChars } from "@/components/anim";
import { Label } from "@/components/ui";

export function VoicesSection() {
  return (
    <>
      {/* ── Voices ───────────────────────────────────────────────────────────
        Replaces "Finding the door", whose content now lives on /contact where
        someone actually planning a trip will look for it.

        ⚠️ Every quote below is PLACEHOLDER. The hotel has not opened, so there
        are no guests and no reviews — see CONTENT.md. Fabricated testimonials
        must not ship; drop real ones into VOICES and nothing else changes. */}
      <section id="voices" className="w-full bg-canvas text-ink section-y">
        <div className="mx-auto mb-16 w-full shell-max shell-px">
          <div className="flex flex-col gap-8 items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <Rise>
                <Label className="opacity-65">Voices</Label>
              </Rise>
              <SplitChars
                lines={["What the road", "leaves with people"]}
                className="font-display text-center mt-8 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02]"
              />
            </div>
          </div>
        </div>

        <Testimonials voices={VOICES} />
      </section>
    </>
  );
}
