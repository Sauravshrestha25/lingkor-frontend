"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePageTransition } from "../context/TransitionContext";
import { PaintedWall, type PaintedWallHandle } from "./PaintedWall";
import { playBell } from "@/lib/bell";

const HOLD_MS = 250;

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Orchestration only. Every physical detail of the transition — the columns, the
 * noise field, the drips, the canvas — lives in `PaintedWall` now; this component's
 * whole job is sequencing three things that have nothing to do with paint: when the
 * bell rings, when the route actually changes, and how long the wall holds fully
 * closed before it lifts.
 *
 * `sweepDown()` / `sweepUp()` each return a promise that resolves when every stroke
 * has finished, so the sequence below is just `await`s in order — no manual timeline
 * positions to keep in sync with a separate visual implementation.
 */
export function PageTransitionOverlay() {
  const { isTransitioning, targetPath, markTransitionDone } =
    usePageTransition();
  const router = useRouter();
  const wallRef = useRef<PaintedWallHandle>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    if (!isTransitioning || !targetPath || runningRef.current) return;
    const wall = wallRef.current;
    if (!wall) return;

    let cancelled = false;
    runningRef.current = true;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    (async () => {
      await wall.sweepDown();
      if (cancelled) return;
      playBell(2);
      router.push(targetPath);
      await wait(HOLD_MS);
      if (cancelled) return;
      await wall.sweepUp();
      if (cancelled) return;
      document.body.style.overflow = originalOverflow;
      runningRef.current = false;
      markTransitionDone();
    })();

    return () => {
      // Marks the in-flight sequence as stale rather than trying to cancel the
      // canvas's own animation frame loop mid-flight — a StrictMode re-run or an
      // unmount mid-sweep just stops this effect from acting on results that arrive
      // after it, instead of fighting the wall for control of its own rAF loop.
      cancelled = true;
      runningRef.current = false;
      document.body.style.overflow = originalOverflow;
    };
  }, [isTransitioning, targetPath, markTransitionDone, router]);

  return <PaintedWall ref={wallRef} />;
}
