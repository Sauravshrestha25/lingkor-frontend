"use client";

import { useDragRail } from "@/lib/useDragRail";
import { Photo } from "@/components/media/Photo";
import { ROOMS } from "../data/rooms";
import { Button } from "@/components/shared/button";
import { Label } from "@/components/ui";
import { Astroid, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * The rooms, as a rail you drag. Transport and proximity focus come from
 * `useDragRail` — the same momentum drag as the spaces carousel and the voices rail.
 */
export default function RoomsRail() {
  const {
    emblaRef,
    focus,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
  } = useDragRail({ dim: false });

  return (
    <div className="shell-max">
      <div
        ref={emblaRef}
        className="cursor-grab overflow-hidden pb-3 pt-6 shell-px active:cursor-grabbing"
      >
        <div className="flex gap-6">
          {ROOMS.map((room, i) => (
            <article
              key={room.id}
              className="group w-[78vw] shrink-0 transition-[opacity,transform] duration-500 ease-out sm:w-[46vw] lg:w-[30vw]"
            >
              {/* Same frame the spaces cards carry, so a room and a space read as two
                views of one house rather than two components. */}
              <div className="relative outline-1 outline-solid outline-amber-300 outline-offset-[10px]">
                <Astroid
                  aria-hidden="true"
                  className="absolute left-1/2 top-[-20px] z-10 size-5 -translate-x-1/2 fill-current text-amber-300"
                  stroke="none"
                />
                <Photo
                  src={`/images/rooms/${room.id}.webp`}
                  alt={`${room.name} — ${room.note}`}
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 30vw"
                  loading={i < 2 ? "eager" : "lazy"}
                  className="aspect-4/5"
                  imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                />
              </div>

              <div className="mt-6 flex items-baseline justify-between border-t border-ink/15 pt-5">
                <div>
                  <h3 className="font-display text-sub">{room.name}</h3>
                  <Label className="mt-6 block font-sub opacity-80">
                    {room.note}
                  </Label>
                </div>
                <Label className="shrink-0 ">{room.size}</Label>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-10 flex w-full items-center justify-between knot-px">
        <Label className="opacity-50">
          {String(focus + 1).padStart(2, "0")} / {ROOMS.length}
        </Label>
        <div className="flex gap-8">
          <Button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous room"
            className="text-label cursor-pointer border border-black/80 px-2 py-2 uppercase opacity-50 transition-opacity duration-300 hover:opacity-100 disabled:cursor-default disabled:opacity-25"
          >
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next room"
            className="text-label cursor-pointer border border-black/80 px-2 py-2 uppercase opacity-50 transition-opacity duration-300 hover:opacity-100 disabled:cursor-default disabled:opacity-25"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
