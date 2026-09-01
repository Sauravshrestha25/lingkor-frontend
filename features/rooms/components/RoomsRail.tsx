"use client";

import { useDragRail } from "@/lib/useDragRail";
import { ROOMS } from "../data/rooms";
import { Button } from "@/components/shared/button";
import { Label } from "@/components/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RoomCard } from "./RoomCard";

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
            <RoomCard
              key={room.id}
              room={room}
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 30vw"
              loading={i < 2 ? "eager" : "lazy"}
              className="group w-[78vw] shrink-0 transition-[opacity,transform] duration-500 ease-out sm:w-[46vw] lg:w-[30vw]"
            />
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
