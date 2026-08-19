"use client";

import { useDragRail } from "@/lib/useDragRail";
import { Photo } from "@/components/media/Photo";
import { ROOMS } from "../data/rooms";
import { Button } from "@/components/shared/button";
import { Label } from "@/components/ui";
import { StarFrame } from "@/components/StarFrame";

/**
 * The rooms, as a rail you drag. Transport and proximity focus come from
 * `useDragRail` — the same momentum drag as the spaces carousel and the voices rail.
 */
export default function RoomsRail() {
  const { emblaRef, embla, focus } = useDragRail();

  return (
    <div className="shell-max">
      <div
        ref={emblaRef}
        className="cursor-grab overflow-hidden shell-px pb-2 active:cursor-grabbing"
      >
        <div className="flex gap-6">
        {ROOMS.map((room, i) => (
          <article
            key={room.id}
            className="group w-[78vw] shrink-0 transition-[opacity,transform] duration-500 ease-out sm:w-[46vw] lg:w-[30vw]"
          >
            {/* Same frame the spaces cards carry, so a room and a space read as two
                views of one house rather than two components. */}
            <StarFrame>
              <Photo
                src={`/images/rooms/${room.id}.webp`}
                alt={`${room.name} — ${room.note}`}
                sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 30vw"
                loading={i < 2 ? "eager" : "lazy"}
                className="aspect-[4/5]"
                imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              />
            </StarFrame>

            <div className="mt-6 flex items-baseline justify-between border-t border-ink/15 pt-5">
              <div>
                <h3 className="font-display text-sub">
                  {room.name}
                </h3>
                <Label className="mt-3 block opacity-50">{room.note}</Label>
              </div>
              <Label className="shrink-0 opacity-40">{room.size}</Label>
            </div>
          </article>
        ))}
        </div>
      </div>

      <div className="mt-10 flex w-full items-center justify-between shell-px">
        <Label className="opacity-50">
          {String(focus + 1).padStart(2, "0")} / {ROOMS.length}
          <span className="ml-4 opacity-70">Drag to explore</span>
        </Label>
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
