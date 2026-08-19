"use client";

import { useDragRail } from "@/lib/useDragRail";
import type { Voice } from "../types";
import { Button } from "@/components/shared/button";
import { Label } from "@/components/ui";
import { VoiceCard } from "./VoiceCard";


/**
 * Guest voices, as a rail of cards you drag.
 *
 * The focal card is chosen by distance from the rail's centre rather than by index:
 * a card half-dragged into place should already be half-lit, which an index-based
 * "active slide" cannot express.
 *
 * Embla drives the drag. This was a hand-rolled pointer-capture rail over native
 * `overflow-x` + scroll-snap, which worked but ended every gesture by snapping to the
 * nearest card — the motion stopped dead the instant you let go. `dragFree: true` is
 * the whole reason for the swap: the rail keeps travelling under its own momentum and
 * decelerates, which is what makes a testimonial rail feel handled rather than paged.
 *
 * Only the transport changed. The cards, the proximity dimming and the controls are
 * the same as before.
 */
export default function Testimonials({ voices }: { voices: Voice[] }) {
  const { emblaRef, embla, focus } = useDragRail();

  const current = voices[focus];

  return (
    <div className="shell-max">
      <div
        ref={emblaRef}
        className="cursor-grab overflow-hidden shell-px pb-2 active:cursor-grabbing"
      >
        <div className="flex gap-6">
          {voices.map((v, i) => (
            <VoiceCard key={v.name + i} voice={v} />
          ))}
        </div>
      </div>

      <div className="mt-12 flex w-full items-center justify-between shell-px">
        <div className="flex items-center gap-5">
          <Label className="opacity-65">
            {String(focus + 1).padStart(2, "0")} /{" "}
            {String(voices.length).padStart(2, "0")}
          </Label>
          <div className="flex gap-2" aria-hidden="true">
            {voices.map((v, i) => (
              <span
                key={v.name + i}
                className="h-px w-8 bg-ink transition-opacity duration-500"
                style={{ opacity: i === focus ? 0.9 : 0.2 }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8">
          <Label className="hidden opacity-50 sm:block">Drag</Label>
          <Button
            type="button"
            onClick={() => embla?.scrollPrev()}
            aria-label="Previous"
            className="text-label cursor-pointer uppercase opacity-65 transition-opacity duration-300 hover:opacity-100"
          >
            Prev
          </Button>
          <Button
            type="button"
            onClick={() => embla?.scrollNext()}
            aria-label="Next"
            className="text-label cursor-pointer uppercase opacity-65 transition-opacity duration-300 hover:opacity-100"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Announce the focal card for assistive tech, which cannot see the dimming. */}
      <p className="sr-only" aria-live="polite">
        {current ? `${current.quote} — ${current.name}, ${current.from}` : ""}
      </p>
    </div>
  );
}
