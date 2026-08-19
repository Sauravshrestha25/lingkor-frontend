"use client";

import type { RefObject } from "react";
import { reduced } from "@/lib/gsap";
import { at, CIRC, HOURS, LAMPS, R } from "../kora";

/**
 * The ring itself: three counter-rotating tiers, the butter lamps, the comet trail and
 * the four stations you can strike.
 *
 * The refs are handed down rather than created here, because the parent owns the one
 * GSAP timeline that drives them — two timelines writing the same transforms would
 * fight each other.
 */
export function KoraRing({
  ringSlowRef,
  ringFastRef,
  walkerRef,
  trailRef,
  pathRef,
  lampsRef,
  held,
  active,
  rung,
  onStrike,
  setHeld,
}: {
  ringSlowRef: RefObject<SVGGElement | null>;
  ringFastRef: RefObject<SVGGElement | null>;
  walkerRef: RefObject<SVGGElement | null>;
  trailRef: RefObject<SVGGElement | null>;
  pathRef: RefObject<SVGCircleElement | null>;
  lampsRef: RefObject<SVGGElement | null>;
  /** Station under the pointer, or null. */
  held: number | null;
  /** Station the scrubbed walk has reached. */
  active: number;
  /** Station that just rang, for the strike flash. */
  rung: number | null;
  onStrike: (i: number) => void;
  setHeld: (i: number | null) => void;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      className="mx-auto h-auto w-full max-w-[32rem]"
      aria-hidden="true"
    >
      {/* Ripple from a struck station, crossing the whole drawing. */}
      <circle
        cx="200"
        cy="200"
        r={rung !== null ? 190 : 60}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity={rung !== null ? 0 : 0.001}
        style={{
          transition:
            rung !== null
              ? "r 900ms cubic-bezier(.22,1,.36,1), opacity 900ms ease-out"
              : "none",
          opacity: rung !== null ? 0 : 0.18,
        }}
      />

      {/* Outer tier — slow, counter-clockwise. */}
      <g ref={ringSlowRef}>
        <circle
          cx="200"
          cy="200"
          r={R + 22}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="1"
          strokeDasharray="1 12"
        />
      </g>

      {/* The circuit itself, drawn in. */}
      <circle
        ref={pathRef}
        cx="200"
        cy="200"
        r={R}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="1"
        strokeDasharray={`${CIRC}`}
        strokeDashoffset={reduced() ? 0 : CIRC}
        transform="rotate(-90 200 200)"
      />

      {/* Butter lamps around the circuit — lit at dawn and dusk. */}
      <g ref={lampsRef} style={{ opacity: 1 }}>
        {Array.from({ length: LAMPS }).map((_, i) => {
          const p = at((i / LAMPS) * Math.PI * 2 - Math.PI / 2, R - 16);
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="1.6"
              // Butter-lamp flame. Local like the sky values in `kora.ts` — a light
              // source in one drawing, not a brand colour the rest of the site may use.
              fill="#E8B872"
              opacity="0.9"
            />
          );
        })}
      </g>

      {/* Inner tier — fast, clockwise. */}
      <g ref={ringFastRef}>
        <circle
          cx="200"
          cy="200"
          r="112"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.1"
          strokeWidth="1"
          strokeDasharray="18 10"
        />
      </g>

      {/* Comet trail, riding just behind the walker. */}
      <g ref={trailRef}>
        <circle
          cx="200"
          cy="200"
          r={R}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${CIRC * 0.06} ${CIRC}`}
          transform="rotate(-96 200 200)"
        />
      </g>

      <g ref={walkerRef}>
        <circle cx="200" cy={200 - R} r="4.5" fill="currentColor" />
        <circle
          cx="200"
          cy={200 - R}
          r="11"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="1"
        />
      </g>

      {/* The four stations. Each rings when reached. */}
      {HOURS.map((h, i) => {
        const { x, y } = at((i / HOURS.length) * Math.PI * 2 - Math.PI / 2, R);
        const on = held === i || active === i;
        return (
          <g
            key={h.time}
            role="button"
            tabIndex={0}
            aria-label={`${h.time} — ${h.label}`}
            onMouseEnter={() => onStrike(i)}
            onMouseLeave={() => setHeld(null)}
            onFocus={() => onStrike(i)}
            onBlur={() => setHeld(null)}
            onClick={() => onStrike(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onStrike(i);
              }
            }}
            className="cursor-pointer focus:outline-none"
          >
            {/* Generous invisible target — the visible dot is 3px. */}
            <circle cx={x} cy={y} r="24" fill="transparent" />

            <circle
              cx={x}
              cy={y}
              r={rung === i ? 30 : 4}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity={rung === i ? 0 : 0.3}
              style={{
                transition:
                  rung === i
                    ? "r 900ms cubic-bezier(.22,1,.36,1), opacity 900ms ease-out"
                    : "none",
              }}
            />

            <circle
              cx={x}
              cy={y}
              r={on ? 5 : 3}
              fill="currentColor"
              opacity={on ? 0.95 : 0.3}
              className="transition-all duration-500"
            />
          </g>
        );
      })}

      <image
        href="/images/art/stupa-white.png"
        x="148"
        y="122"
        width="104"
        height="156"
        opacity="0.5"
        preserveAspectRatio="xMidYMid meet"
        style={{ mixBlendMode: "difference" }}
      />
    </svg>
  );
}
