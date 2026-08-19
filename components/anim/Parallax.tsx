"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, reduced } from "../../lib/gsap";

/**
 * A photograph that drifts against the scroll. DESIGN.md §5 caps the travel at 8% of
 * the frame height — past that it stops reading as depth and starts reading as a
 * template. The image is scaled to cover the drift so no edge is ever exposed.
 *
 * `fill` rather than intrinsic dimensions: the frame's shape is the layout's decision
 * (a grid cell, an aspect ratio, `70svh`), never the file's own proportions. The frame
 * is `relative` because `fill` positions the image absolutely against it.
 */
export function Parallax({
  src,
  alt,
  className = "",
  imgClassName = "",
  strength = 8,
  sizes = "100vw",
  preload = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Percent of frame height, each way. */
  strength?: number;
  sizes?: string;
  preload?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const frame = ref.current;
    const img = frame?.querySelector("img");
    if (!frame || !img || reduced()) return;

    const tween = gsap.fromTo(
      img,
      { yPercent: -strength },
      {
        yPercent: strength,
        ease: "none",
        scrollTrigger: {
          trigger: frame,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [strength]);

  return (
    <figure
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      aria-hidden={alt === "" || undefined}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        draggable={false}
        className={`select-none object-cover ${imgClassName}`}
        // Scaled to cover the drift, so the travel never exposes an edge.
        style={{ scale: 1 + strength / 40 }}
      />
    </figure>
  );
}
