"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/shared/button";
// import { BOUDHA } from "@/lib/photo";

export function EntryStage({
  onSound,
  onSilent,
  leaving = false,
}: {
  onSound: () => void;
  onSilent: () => void;
  leaving?: boolean;
}) {
  return (
    <div
      data-entry-stage
      className={`fixed inset-0 z-100 grid place-items-center overflow-hidden bg-netsang px-6 text-ink transition-opacity duration-1000 ease-out ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* <NextImage
        src={BOUDHA}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      /> */}

      <div
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light"
        style={{
          backgroundImage: "url('/images/art/wall-grain.webp')",
          backgroundSize: "240px",
        }}
        aria-hidden
      />
      <div className="relative flex w-full max-w-2xl flex-col items-center text-center">
        <p className="font-sub text-xl uppercase tracking-[0.28em] text-ink">
          Welcome to{" "}
        </p>
        <h1 className="mt-5 font-display text-[clamp(2.4rem,6vw,5.6rem)] leading-none">
          Lingkor Boudha
        </h1>
        <p className="mt-12 max-w-[24rem] font-body text-body leading-relaxed text-ink/40 sm:text-[1.1rem]">
          Enter with a calm soundscape, or arrive in silence.
        </p>
        <div className="mt-10 flex flex-col w-full max-w-[20rem] gap-3 ">
          <Button
            type="button"
            onClick={onSound}
            disabled={leaving}
            className="group cursor-pointer flex min-h-14 items-center justify-center gap-3 border border-ink bg-ink px-5 font-sub text-sm uppercase tracking-[0.22em] text-white transition-colors hover:text-ink hover:bg-space"
          >
            <Volume2 className="size-4" aria-hidden />
            With Sound
          </Button>
          <Button
            type="button"
            onClick={onSilent}
            disabled={leaving}
            className="group cursor-pointer flex min-h-14 items-center justify-center gap-3 border border-ink/45 px-5 font-sub text-sm uppercase tracking-[0.22em] text-ink  transition-colors hover:border-white hover:bg-white"
          >
            <VolumeX className="size-4" aria-hidden />
            Silent Entry
          </Button>
        </div>
      </div>
    </div>
  );
}
