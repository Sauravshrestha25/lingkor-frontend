"use client";

import { useRef } from "react";
import gsap from "gsap";

export function ExternalLinkIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  const arrowRef = useRef<SVGGElement>(null);

  const onEnter = () => {
    gsap.to(arrowRef.current, { x: 2, y: -2, scale: 0.92, duration: 0.25, ease: "power2.out", transformOrigin: "top right" });
  };
  const onLeave = () => {
    gsap.to(arrowRef.current, { x: 0, y: 0, scale: 1, duration: 0.25, ease: "power2.out" });
  };

  return (
    <svg
      fill="none"
      height={size}
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <g ref={arrowRef}>
        <path d="M15 3h6v6" />
        <path d="M10 14 21 3" />
      </g>
    </svg>
  );
}
