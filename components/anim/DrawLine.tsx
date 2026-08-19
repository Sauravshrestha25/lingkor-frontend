"use client";

import { useEffect, useRef } from "react";
import { gsap, reduced } from "../../lib/gsap";

/**
 * A rule that draws itself across as it enters — used for the one line that stands
 * for the road between Mustang and Boudha, where a static border would say nothing.
 */
export function DrawLine({
  className = "",
  origin = "left",
}: {
  className?: string;
  /**
   * Which end the line grows from. Two lines with opposing origins draw toward each
   * other and meet in the middle — which is the point being made wherever two things
   * converge on one road.
   */
  origin?: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      gsap.set(el, { scaleX: 1 });
      return;
    }

    const tween = gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.6,
        ease: "power3.inOut",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`h-px w-full ${origin === "right" ? "origin-right" : "origin-left"} ${className}`}
      style={{ transform: "scaleX(0)" }}
    />
  );
}
