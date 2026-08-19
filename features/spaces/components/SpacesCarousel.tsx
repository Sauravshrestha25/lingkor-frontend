"use client";

import Link from "next/link";
import { useDragRail } from "@/lib/useDragRail";
import type { Space } from "../types";
import { blendsWithGround } from "@/lib/site";
import { DragCursor } from "@/components/DragCursor";
import { CloudMotif } from "@/components/media/CloudMotif";
import { StarFrame } from "@/components/StarFrame";
import { Photo } from "@/components/media/Photo";
import { Button } from "@/components/shared/button";
import { Label } from "@/components/ui";

/**
 * The five spaces as a carousel you drag — no pinning.
 *
 * The previous version hijacked the scroll: it pinned the section and converted
 * vertical wheel into horizontal travel, which means the page stops going where the
 * user told it to go. That reads as clever once and as broken every time after.
 *
 * Transport and proximity focus come from `useDragRail`: a momentum drag that stays
 * out of the way of a genuine vertical scroll, shared with the rooms and voices rails.
 *
 * Each card is a link to its own page, and each carries the cabinet-door cloud tinted by
 * its element — the brief's "kind of mosaic with the 5 elements" and "the tibetan clouds
 * like on the cabinets", both landing on the cards that already exist rather than on a
 * second set of tiles saying the same five things over again.
 */
export default function SpacesCarousel({ spaces }: { spaces: Space[] }) {
  const { emblaRef, embla, focus, clickAllowed } = useDragRail();

  return (
    <div className="shell-max">
      {/* `relative` so DragCursor can position against it, and it wraps the rail
          rather than sitting inside it — inside the viewport's `overflow-hidden`
          the label would be clipped as soon as the pointer neared an edge. */}
      <div className="relative">
        <DragCursor />
        <div
          ref={emblaRef}
          className="cursor-grab overflow-hidden shell-px active:cursor-grabbing"
        >
          <div className="flex gap-6">
            {spaces.map((space, i) => {
              const white = space.displayOnField === "white";
              return (
                <Link
                  key={space.id}
                  id={space.id}
                  href={`/spaces/${space.id}`}
                  // A drag that ends over a card is still a click as far as the browser
                  // is concerned, so without this every flick would navigate.
                  onClick={(e) => {
                    if (!clickAllowed()) e.preventDefault();
                  }}
                  className="group w-[86vw] shrink-0 transition-[opacity,transform] duration-500 ease-out sm:w-[62vw] lg:w-[46vw]"
                >
                  {/* The card is the element field; the photograph sits framed inside
                    it, with the star seated on the frame's top edge. The frame takes
                    `currentColor`, so it follows the card's own type colour rather
                    than needing a value per element. */}
                  <div
                    className={`relative h-full overflow-hidden p-5 lg:p-6 ${
                      // Namkha's field is the page ground, so the card has no outer edge
                      // of its own — see `blendsWithGround`.
                      blendsWithGround(space.field)
                        ? "ring-1 ring-inset ring-ink/12"
                        : ""
                    }`}
                    style={{
                      backgroundColor: space.field,
                      color: white ? "var(--color-space)" : "var(--color-ink)",
                    }}
                  >
                    <CloudMotif className="pointer-events-none absolute -top-2 right-4 w-32 opacity-20 transition-transform duration-1400 ease-brand group-hover:-translate-x-3 lg:w-44" />

                    <StarFrame>
                      <Photo
                        src={space.image}
                        alt=""
                        sizes="(max-width: 640px) 86vw, (max-width: 1024px) 62vw, 46vw"
                        loading={i < 2 ? "eager" : "lazy"}
                        className="aspect-video"
                      />
                    </StarFrame>

                    <div className="relative mt-7 flex items-baseline justify-between">
                      <Label className="opacity-70">{space.role}</Label>
                      <Label className="opacity-70">
                        {String(i + 1).padStart(2, "0")} /{" "}
                        {String(spaces.length).padStart(2, "0")}
                      </Label>
                    </div>

                    <h3 className="font-display relative mt-4 text-[clamp(1.875rem,3.2vw,2.75rem)] leading-none">
                      {space.name}
                    </h3>

                    <p className="text-body relative mt-6 max-w-[42ch]">
                      {space.line}
                    </p>

                    <div className="relative mt-6 flex items-baseline justify-between gap-4">
                      <Label className="opacity-60">
                        {space.element} · {space.hue}
                      </Label>
                      <Label className="shrink-0 opacity-0 transition-opacity duration-500 group-hover:opacity-70">
                        Enter
                      </Label>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-10 flex w-full items-center justify-between shell-px">
        <div className="flex gap-2">
          {spaces.map((s, i) => (
            <span
              key={s.id}
              aria-hidden="true"
              className="h-px w-8 bg-ink transition-opacity duration-500"
              style={{ opacity: i === focus ? 0.85 : 0.2 }}
            />
          ))}
        </div>

        <div className="flex gap-8">
          <Button
            type="button"
            onClick={() => embla?.scrollPrev()}
            className="text-label cursor-pointer uppercase opacity-50 transition-opacity duration-300 hover:opacity-100"
          >
            Prev
          </Button>
          <Button
            type="button"
            onClick={() => embla?.scrollNext()}
            className="text-label cursor-pointer uppercase opacity-50 transition-opacity duration-300 hover:opacity-100"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
