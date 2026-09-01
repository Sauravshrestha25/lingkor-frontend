"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { playBell } from "@/lib/bell";
import { usePageTransition } from "../context/TransitionContext";

const SLIDE_MS = 620;
const HOLD_MS = 120;

function wait(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

type Phase = "idle" | "before" | "entering" | "covered" | "leaving";

const phaseTransform: Record<Exclude<Phase, "idle">, string> = {
  before: "translate3d(0, -100%, 0)",
  entering: "translate3d(0, 0, 0)",
  covered: "translate3d(0, 0, 0)",
  leaving: "translate3d(0, -100%, 0)",
};

export function WhiteLogoPageTransition() {
  const { isTransitioning, targetPath, markTransitionDone } =
    usePageTransition();
  const router = useRouter();
  const runningRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (!isTransitioning || !targetPath || runningRef.current) return;

    let cancelled = false;
    runningRef.current = true;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    setPhase("before");

    const phaseFrame = window.requestAnimationFrame(() => {
      setPhase("entering");
    });

    (async () => {
      await wait(SLIDE_MS + 16);
      if (cancelled) return;
      setPhase("covered");
      playBell(2);
      router.push(targetPath);
      await wait(HOLD_MS);
      if (cancelled) return;
      setPhase("leaving");
      await wait(SLIDE_MS);
      if (cancelled) return;
      document.body.style.overflow = originalOverflow;
      runningRef.current = false;
      setPhase("idle");
      markTransitionDone();
    })();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(phaseFrame);
      runningRef.current = false;
      document.body.style.overflow = originalOverflow;
    };
  }, [isTransitioning, targetPath, markTransitionDone, router]);

  if (phase === "idle") return null;

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-netsang transition-transform duration-[620ms] ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform"
      style={{ transform: phaseTransform[phase] }}
      aria-hidden
    >
      <Image
        src="/Logo/logo.svg"
        alt=""
        width={760}
        height={254}
        priority
        className="h-auto w-[min(72vw,34rem)]"
      />
    </div>
  );
}
