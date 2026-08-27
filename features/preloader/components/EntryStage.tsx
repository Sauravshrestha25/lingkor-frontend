"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/shared/button";
import gsap from "gsap";

type EntryMode = "sound" | "silent";

export function EntryStage({
  onSound,
  onSilent,
  leaving = false,
}: {
  onSound: () => void;
  onSilent: () => void;
  leaving?: boolean;
}) {
  const [entering, setEntering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<EntryMode | null>(null);

  // Entrance: heading and buttons fade up; door appears immediately (no sceneRef opacity)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { opacity: 0, y: 16 });
      gsap.set(buttonsRef.current, { opacity: 0, y: 12 });

      gsap.timeline({ delay: 0.1 })
        .to(headingRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to(buttonsRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.25");
    });
    return () => ctx.revert();
  }, []);

  const handleEnter = (mode: EntryMode) => {
    if (entering || leaving) return;
    modeRef.current = mode;
    setEntering(true);

    const video = videoRef.current;
    if (!video) {
      (mode === "sound" ? onSound : onSilent)();
      return;
    }

    video.muted = mode === "silent";
    video.play().catch(() => {});

    // Heading and buttons vanish fast
    gsap.to([buttonsRef.current, headingRef.current], {
      opacity: 0, duration: 0.2, ease: "power2.in",
    });

    const cb = mode === "sound" ? onSound : onSilent;
    const tl = gsap.timeline();
    rushTlRef.current = tl;

    // 1. Camera drifts then blasts through door
    tl.to(sceneRef.current, { scale: 8, duration: 2.6, ease: "power2.in" }, 0)
      // 2. Stage bg bleeds to ink while door fills viewport
      .to(stageRef.current, { backgroundColor: "#1c1a17", duration: 1.0, ease: "power1.inOut" }, 1.5)
      // 3. Door video fades out → exposes the ink bg cleanly (dark beat lands here)
      .to(sceneRef.current, { opacity: 0, duration: 0.55, ease: "power2.in" }, 2.1)
      // 4. Enter fires into darkness
      .call(cb, [], 2.75)
      // 5. Dark stage slowly dissolves → preloader breathes into life from nothing
      .to(stageRef.current, { opacity: 0, duration: 1.2, ease: "power1.inOut" }, 3.0);
  };

  const rushTlRef = useRef<gsap.core.Timeline | null>(null);

  // Escape during door animation = skip straight through
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !modeRef.current) return;
      rushTlRef.current?.kill();
      gsap.killTweensOf([sceneRef.current, stageRef.current, buttonsRef.current, headingRef.current]);
      const cb = modeRef.current === "sound" ? onSound : onSilent;
      cb();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSound, onSilent]);

  return (
    <div
      ref={stageRef}
      data-entry-stage
      className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden bg-netsang text-ink"
    >
      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light"
        style={{
          backgroundImage: "url('/images/art/wall-grain.webp')",
          backgroundSize: "240px",
        }}
        aria-hidden
      />

      {/* Scene */}
      <div
        ref={sceneRef}
        className="relative flex w-full flex-col items-center will-change-transform"
      >
        {/* Heading */}
        <div ref={headingRef} className="px-6 text-center">
          <p className="font-sub text-4xl uppercase tracking-[0.32em] text-ink">
            དགའ་བསུ
          </p>
          <p className="font-sub text-sm my-4 uppercase tracking-[0.32em] text-ink">
            Welcome TO
          </p>
          <h1 className="mt-2 font-display text-[clamp(2rem,5vw,3.5rem)] leading-none">
            Lingkor Boudha
          </h1>
        </div>

        {/* Door — mix-blend-multiply makes its white bg seamless against netsang */}
        <div className="mt-3 w-[min(580px,88vw)]">
          <video
            ref={videoRef}
            src="/video/Dooropen1.mp4"
            playsInline
            preload="auto"
            className="block w-full h-auto"
            style={{
              maxHeight: "58vh",
            }}
          />
        </div>

        {/* Buttons */}
        <div
          ref={buttonsRef}
          className="flex w-full max-w-[20rem] flex-col gap-3 px-6"
        >
          <Button
            type="button"
            onClick={() => handleEnter("sound")}
            disabled={entering || leaving}
            className="group cursor-pointer flex min-h-14 items-center justify-center gap-3 border border-ink bg-ink px-5 font-sub text-sm uppercase tracking-[0.22em] text-white transition-colors hover:text-ink hover:bg-space"
          >
            <Volume2 className="size-4" aria-hidden />
            With Sound
          </Button>
          <Button
            type="button"
            onClick={() => handleEnter("silent")}
            disabled={entering || leaving}
            className="group cursor-pointer flex min-h-14 items-center justify-center gap-3 border border-ink/45 px-5 font-sub text-sm uppercase tracking-[0.22em] text-ink transition-colors hover:border-white hover:bg-white"
          >
            <VolumeX className="size-4" aria-hidden />
            Silent Entry
          </Button>
        </div>
      </div>
    </div>
  );
}
