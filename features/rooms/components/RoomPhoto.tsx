"use client";

import { useRef } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { Photo } from "@/components/media/Photo";
import type { Room } from "../data/rooms";
import { Button } from "@/components/shared/button";

export function RoomPhoto({ room }: { room: Room }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const src = `/images/rooms/${room.id}.webp`;
  return (
    <>
      <div className="group relative w-full text-white">
        <Photo src={src} alt={`${room.name} — ${room.note}`} sizes="(min-width: 768px) 90vw, 100vw" preload className="h-[58svh] min-h-80 md:h-[68svh]" imgClassName="transition-transform duration-1000 group-hover:scale-[1.015]" />
        <div className="absolute right-5 bottom-5 rounded-full bg-black/45 backdrop-blur-sm">
          <Button type="button" onClick={() => dialog.current?.showModal()} aria-label={`View full photograph of the ${room.name}`} className="cursor-zoom-in"><Maximize2 aria-hidden="true" className="size-4" /></Button>
        </div>
      </div>
      <dialog ref={dialog} aria-label={`${room.name} photograph`} data-lenis-prevent onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} className="fixed inset-0 m-auto h-[92svh] max-h-none w-[96vw] max-w-none border-0 bg-midnight p-5 text-white backdrop:bg-black/90 md:p-12">
        <div className="pointer-events-none relative h-full w-full">
          <Image src={src} alt={`${room.name} — full room photograph`} fill sizes="96vw" className="object-contain" />
        </div>
        <Button autoFocus type="button" onClick={() => dialog.current?.close()} aria-label="Close photograph" className="absolute top-3 right-3 cursor-pointer text-white"><X aria-hidden="true" className="size-6" /></Button>
      </dialog>
    </>
  );
}
