import { blendsWithGround } from "@/lib/site";
import { Label } from "@/components/ui";
import type { Voice } from "../types";
import { Portrait } from "./Portrait";
import { Stars } from "./Stars";

/**
 * One testimonial, on white.
 *
 * The cards used to take the five element colours as their grounds. They are white now,
 * which puts the weight on the portrait and the words instead of on a rail of coloured
 * panels — and it means one type colour and one contrast ratio rather than a per-colour
 * judgement (`onTint`) that had to be made in the data.
 *
 * The element has not left, it has moved: it is the stars, so the palette still runs
 * through the rail without owning the card. Namkha's own colour IS the page ground, so
 * that one card's stars would vanish; it falls back to earth — see `starTint`.
 *
 * Every card carries a hairline, because white on the off-white ground is a difference
 * too slight to hold an edge on its own.
 *
 * `transition-[opacity,transform]` rather than `transition-all`: the rail writes
 * `opacity` and `transform` inline on every frame of the drag, and transitioning
 * everything would drag unrelated properties into that per-frame work.
 */
export function VoiceCard({ voice }: { voice: Voice }) {
  const starTint = blendsWithGround(voice.tint)
    ? "var(--color-earth)"
    : voice.tint;

  return (
    <figure
      className="w-[82vw] shrink-0 bg-white ring-1 ring-inset ring-ink/12 transition-[opacity,transform] duration-500 ease-out sm:w-[54vw] lg:w-[30vw]"
      style={{ color: "var(--color-ink)" }}
    >
      <Portrait voice={voice} />

      <div className="flex flex-col p-6 lg:p-7">
        {/* The one place the element still shows. */}
        <Stars rating={voice.rating} tint={starTint} />

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
