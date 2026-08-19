import { blendsWithGround } from "@/lib/site";
import { Label } from "@/components/ui";
import type { Voice } from "../types";
import { Portrait } from "./Portrait";
import { Stars } from "./Stars";

/**
 * One testimonial, on its own element colour.
 *
 * The cards used to be uniform off-white with the element showing only in the stars and
 * the room label — a rail of five identical panels. They now cycle the five grounds in
 * the order the spaces are introduced, so the rail carries the palette the same way the
 * rest of the page does and no two adjacent cards repeat a colour.
 *
 * Type colour comes from `onTint` rather than being computed from the ground, because
 * the answer is not derivable from lightness alone: white on the ochre measures 2.25:1
 * and ink on it 6.60:1, so the choice is a contrast judgement per colour, made once, in
 * the data.
 *
 * `transition-[opacity,transform]` rather than `transition-all`: the rail writes
 * `opacity` and `transform` inline on every frame of the drag, and transitioning
 * everything would drag unrelated properties into that per-frame work.
 */
export function VoiceCard({ voice }: { voice: Voice }) {
  const white = voice.onTint === "white";

  return (
    <figure
      className={`w-[82vw] shrink-0 transition-[opacity,transform] duration-500 ease-out sm:w-[54vw] lg:w-[30vw] ${
        // Namkha's off-white is the page ground too, so that one card has no edge of
        // its own — see `blendsWithGround`.
        blendsWithGround(voice.tint) ? "ring-1 ring-inset ring-ink/12" : ""
      }`}
      style={{
        backgroundColor: voice.tint,
        color: white ? "var(--color-space)" : "var(--color-ink)",
      }}
    >
      <Portrait voice={voice} />

      <div className="flex flex-col p-6 lg:p-7">
        {/* Stars take the type colour, not the element: on a card whose ground *is*
            the element, an element-coloured star is invisible. */}
        <Stars
          rating={voice.rating}
          tint={white ? "var(--color-space)" : "var(--color-ink)"}
        />

        {/* Full strength, not 90%: on slate and fire the ground is dark enough
            that a 10% fade costs more contrast than the card can spare. */}
        <blockquote className="text-body mt-4 min-h-[5rem]">
          {voice.quote}
        </blockquote>

        <figcaption className="mt-5 border-t border-current/20 pt-4">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-display text-[clamp(1.25rem,1.7vw,1.5rem)] leading-none">
              {voice.name}
            </p>
            {voice.room && (
              <Label className="shrink-0 opacity-70">{voice.room}</Label>
            )}
          </div>
          <Label className="mt-2 block opacity-60">{voice.from}</Label>
        </figcaption>
      </div>
    </figure>
  );
}
