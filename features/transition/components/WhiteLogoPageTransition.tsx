"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { playBell } from "@/lib/bell";
import { usePageTransition } from "../context/TransitionContext";

const SLIDE_MS = 900; // must match the .pt-enter / .pt-leave animation duration in globals.css
const HOLD_MS = 120;

function wait(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

// enter  — curtain slides DOWN from above into full cover (.pt-enter)
// covered — parked over the viewport while the route swaps
// leave  — curtain slides UP off the top (.pt-leave)
type Phase = "idle" | "enter" | "covered" | "leave";

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

    setPhase("enter");

    (async () => {
      await wait(SLIDE_MS);
      if (cancelled) return;
      setPhase("covered");
      playBell(2);
      router.push(targetPath);
      await wait(HOLD_MS);
      if (cancelled) return;
      setPhase("leave");
      await wait(SLIDE_MS);
      if (cancelled) return;
      document.body.style.overflow = originalOverflow;
      runningRef.current = false;
      setPhase("idle");
      markTransitionDone();
    })();

    return () => {
      cancelled = true;
      runningRef.current = false;
      document.body.style.overflow = originalOverflow;
    };
  }, [isTransitioning, targetPath, markTransitionDone, router]);

  if (phase === "idle") return null;

  const anim =
    phase === "enter" ? "pt-enter" : phase === "leave" ? "pt-leave" : "";

  return (
    <div
      className={`fixed inset-0 z-[90] grid place-items-center bg-netsang will-change-transform ${anim}`}
      // "covered" carries no animation class, so pin it in place explicitly.
      style={phase === "covered" ? { transform: "translate3d(0,0,0)" } : undefined}
      aria-hidden
    >
      <Image
        src="/Logo/logo-brick.svg"
        alt=""
        width={760}
        height={254}
        priority
        className="h-auto w-[min(72vw,34rem)]"
      />
    </div>
  );
}
