import SpacesCarousel from "@/features/spaces/components/SpacesCarousel";
import { SPACES } from "@/features/spaces/data/spaces";
import { Rise, SplitChars } from "@/components/anim";
import { Label } from "@/components/ui";

/**
 * The five spaces.
 *
 * There was briefly a mosaic of colour tiles above this, on the reading that the brief's
 * "kind of mosaic with the 5 elements" needed all five colours visible at once. It was
 * redundant: the carousel cards already carry the element colour as their ground, so the
 * page said the same five things twice and the reader had to work out whether the tiles
 * and the cards were different sets. The mosaic quality now lives in the cards
 * themselves — element ground, cabinet-door cloud, and each one a door into its space.
 *
 * Copy is short by intent. "Text is minimal", and the cards say the rest.
 */
export function SpacesSection() {
  return (
    <>
      <section className="w-full bg-canvas pt-(--space-section) pb-14">
        <div className="mx-auto w-full shell-max shell-px">
          <Rise>
            <Label className="opacity-60">Five elements, five rooms</Label>
          </Rise>
          <SplitChars
            lines={["The hotel is a circuit"]}
            className="font-display mt-8 text-[clamp(2rem,4.5vw,4rem)] leading-[1.02]"
          />
        </div>
      </section>

      <SpacesCarousel spaces={SPACES} />
    </>
  );
}
