"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { noise2DSigned } from "@/lib/noise";

/**
 * The page transition wall — one shared canvas, redrawn every frame from a small
 * noise-driven model, rather than five divs clipped to a hand-typed polygon.
 *
 * **Why the polygons read as cartoonish.** A `clip-path: polygon(...)` edge is a fixed
 * set of straight line segments — it never moves once written, so however jagged it
 * looks in the first frame is exactly how it looks in every frame after. A real wet
 * edge is never that still. This version computes the boundary fresh every frame from
 * a continuous noise field, so it visibly ripples while it travels rather than sliding
 * as one rigid cutout.
 *
 * **Why one canvas instead of five elements.** Colour bleed at a seam needs two colours
 * sharing actual pixels — that's not achievable between two separate DOM nodes without
 * a third overlay faking it. One canvas gives real compositing: the second stroke is
 * painted over the first with a ramped `globalAlpha` across their overlap band, so the
 * two colours physically blend where real wet paint would.
 *
 * **What each stroke gets, every frame:**
 * - A leading edge offset by 2D value-noise (`noise2D`), so it ripples continuously.
 * - A handful of drip points at fixed x-positions that lag behind the main edge with
 *   their own exponential ease — real drips arrive a beat after the paint that fed them.
 * - A thin lighter stroke traced along the leading edge — a sheen, not a highlight
 *   layer, so it only exists where the edge currently is.
 * - Jittered side boundaries, for the same reason as the bottom: a dead-straight vertical
 *   seam is the other half of what read as five rectangles rather than one wall.
 * - The site's own `wall-grain.webp` plate, drawn with `multiply`, exactly as the CSS
 *   version did — still real photographed plaster, not a canvas-drawn texture.
 *
 * **Timing lives outside this component.** `sweepDown` / `sweepUp` are the entire
 * surface area: each returns a promise that resolves when every stroke has finished,
 * so `PageTransitionOverlay` can sequence the bell, the route change and the hold
 * without knowing anything about columns, noise, or canvas at all.
 */

const STROKES = [
  { id: "ghegu", token: "--color-wind", left: 0, width: 0.235, seed: 11 },
  { id: "menthang", token: "--color-water", left: 0.19, width: 0.245, seed: 37 },
  { id: "namkha", token: "--color-namkha", left: 0.39, width: 0.235, seed: 59 },
  { id: "netsang", token: "--color-earth", left: 0.58, width: 0.245, seed: 83 },
  { id: "luri", token: "--color-fire", left: 0.77, width: 0.24, seed: 101 },
] as const;

const GRAIN_SRC = "/images/art/wall-grain.webp";

// Per-stroke timing. Shorter than the first version, per the brief — a route change
// shouldn't cost more than about a second and a half of watching paint.
const STAGGER = 0.07;
const SWEEP_DOWN = 0.46;
const SWEEP_UP = 0.5;
const EDGE_MARGIN = 90; // px of travel past both bounds, so ripple/drip peaks never clip
const RIPPLE_AMP = 14;
const RIPPLE_FREQ = 0.006;
const RIPPLE_SPEED = 1.6;
const SIDE_JITTER_AMP = 10;
const DRIPS_PER_STROKE = 4;
const DRIP_MAX_LEN = 46;
const DRIP_EASE = 0.06; // per-frame lerp toward target — the lag that makes it a "drip"

function rgbStr(rgb: [number, number, number] | undefined, alpha = 1): string {
  const [r, g, b] = rgb ?? [136, 136, 136];
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

type Direction = "down" | "up" | null;

export type PaintedWallHandle = {
  /** Resolves once every stroke has fully covered the viewport. */
  sweepDown: () => Promise<void>;
  /** Resolves once every stroke has fully retreated off-screen. */
  sweepUp: () => Promise<void>;
};

export const PaintedWall = forwardRef<PaintedWallHandle, { className?: string }>(
  function PaintedWall({ className = "" }, ref) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const visibleRef = useRef(false);

    const directionRef = useRef<Direction>(null);
    const startRef = useRef(0);
    const resolveRef = useRef<(() => void) | null>(null);
    const rafRef = useRef(0);

    // Stored as resolved RGB channels, not CSS strings. Canvas fillStyle happily
    // accepts a raw CSS custom property value at draw time, but the *served*
    // stylesheet is not guaranteed to match what was written in globals.css — Lightning
    // CSS (Turbopack's minifier) shortens `#ffffff` to `#fff`, and `${c}00` on a
    // 3-digit hex produces `#fff00`, which is not a valid colour of any length canvas
    // will parse. Resolving to actual `[r,g,b]` once, via a throwaway 1x1 canvas that
    // does the real parsing for us, sidesteps string-format assumptions entirely —
    // it works the same whether the source was 3-digit, 6-digit, `rgb()`, or anything
    // else CSS can express.
    const colorsRef = useRef<[number, number, number][]>([]);
    const patternRef = useRef<CanvasPattern | null>(null);
    // Drip state persists across frames — that's what lets it lag rather than track.
    const dripStateRef = useRef<number[][]>(STROKES.map(() => []));
    const dripTargetRef = useRef<number[][]>(STROKES.map(() => []));

    useEffect(() => {
      // Resolved once, on mount: these are static brand hexes, not a themeable value —
      // canvas fillStyle cannot read a CSS custom property directly.
      const root = getComputedStyle(document.documentElement);
      const probe = document.createElement("canvas");
      probe.width = probe.height = 1;
      const probeCtx = probe.getContext("2d");
      colorsRef.current = STROKES.map((s) => {
        const raw = root.getPropertyValue(s.token).trim();
        if (!probeCtx) return [136, 136, 136];
        probeCtx.clearRect(0, 0, 1, 1);
        probeCtx.fillStyle = raw;
        probeCtx.fillRect(0, 0, 1, 1);
        const [r, g, b] = probeCtx.getImageData(0, 0, 1, 1).data;
        return [r, g, b];
      });

      // Deterministic drip x-positions and lengths, seeded per stroke so they are
      // stable across every transition rather than re-randomised each time.
      STROKES.forEach((s, i) => {
        const targets: number[] = [];
        for (let d = 0; d < DRIPS_PER_STROKE; d++) {
          const n = noise2DSigned(s.seed + d * 3.7, 0);
          targets.push(DRIP_MAX_LEN * (0.5 + 0.5 * (n + 1) * 0.5));
        }
        dripTargetRef.current[i] = targets;
        dripStateRef.current[i] = targets.map(() => 0);
      });

      const img = new Image();
      img.src = GRAIN_SRC;
      img.onload = () => {
        const c = canvasRef.current;
        const ctx = c?.getContext("2d");
        if (ctx) patternRef.current = ctx.createPattern(img, "repeat");
      };
    }, []);

    function resizeCanvas() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      const ctx = canvas.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(now: number) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || !directionRef.current) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const t = (now - startRef.current) / 1000;
      const dir = directionRef.current;

      ctx.clearRect(0, 0, w, h);

      let allDone = true;
      const step = 10; // px between sampled edge points — cheap and smooth enough

      STROKES.forEach((s, i) => {
        const offset =
          dir === "down"
            ? i * STAGGER
            : (STROKES.length - 1 - i) * STAGGER;
        const dur = dir === "down" ? SWEEP_DOWN : SWEEP_UP;
        const raw = Math.min(1, Math.max(0, (t - offset) / dur));
        const eased = easeInOutCubic(raw);
        if (raw < 1) allDone = false;

        const coverAmount = dir === "down" ? eased : 1 - eased;
        const baseY = -EDGE_MARGIN + coverAmount * (h + 2 * EDGE_MARGIN);

        const left = s.left * w;
        const right = (s.left + s.width) * w;

        // Overlap band with the previous stroke, for the seam blend below.
        const prev = i > 0 ? STROKES[i - 1] : null;
        const overlapStart = prev ? left : left;
        const overlapEnd = prev ? Math.min(right, (prev.left + prev.width) * w) : left;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(left, 0);
        ctx.lineTo(right, 0);

        // Right boundary: jittered, not a straight vertical line.
        for (let y = 0; y <= baseY + EDGE_MARGIN; y += 24) {
          const jx = right + noise2DSigned(s.seed + 4, y * 0.02 + t * 0.4) * SIDE_JITTER_AMP;
          ctx.lineTo(jx, y);
        }

        // Bottom boundary: the noisy, rippling leading edge.
        for (let x = right; x >= left; x -= step) {
          const ripple =
            RIPPLE_AMP *
            noise2DSigned(x * RIPPLE_FREQ + s.seed, t * RIPPLE_SPEED);
          ctx.lineTo(x, baseY + ripple);
        }

        // Left boundary, jittered the same way, back up to the top.
        for (let y = baseY + EDGE_MARGIN; y >= 0; y -= 24) {
          const jx = left + noise2DSigned(s.seed + 9, y * 0.02 + t * 0.4) * SIDE_JITTER_AMP;
          ctx.lineTo(jx, y);
        }
        ctx.closePath();

        // Base fill. Within the overlap band, ramp alpha from 0 (touching the
        // previous stroke's territory) to 1 (this stroke's own colour) — real
        // compositing over already-painted pixels, which is what makes this a blend
        // rather than a second opaque shape sitting on top.
        if (prev && overlapEnd > overlapStart) {
          const grad = ctx.createLinearGradient(overlapStart, 0, overlapEnd, 0);
          grad.addColorStop(0, rgbStr(colorsRef.current[i], 0));
          grad.addColorStop(1, rgbStr(colorsRef.current[i]));
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.fillStyle = rgbStr(colorsRef.current[i]);
          ctx.globalCompositeOperation = "source-atop";
          ctx.fillRect(overlapEnd, 0, right - overlapEnd, h);
          ctx.globalCompositeOperation = "source-over";
        } else {
          ctx.fillStyle = rgbStr(colorsRef.current[i]);
          ctx.fill();
        }

        // The real photographed grain, multiplied over the same shape.
        if (patternRef.current) {
          ctx.globalCompositeOperation = "multiply";
          ctx.fillStyle = patternRef.current;
          ctx.fill();
          ctx.globalCompositeOperation = "source-over";
        }

        // Drips: a few fixed x-positions per stroke, each lagging toward its target
        // length rather than tracking the main edge instantly.
        const active = coverAmount > 0.02 && coverAmount < 0.98;
        const dripXs = dripTargetRef.current[i].map(
          (_, d) => left + ((d + 0.5) / DRIPS_PER_STROKE) * (right - left),
        );
        dripTargetRef.current[i].forEach((target, d) => {
          const cur = dripStateRef.current[i][d];
          const goal = active ? target : 0;
          dripStateRef.current[i][d] = cur + (goal - cur) * DRIP_EASE;
          const len = dripStateRef.current[i][d];
          if (len < 1) return;
          const x = dripXs[d];
          const ripple = RIPPLE_AMP * noise2DSigned(x * RIPPLE_FREQ + s.seed, t * RIPPLE_SPEED);
          const dripTop = baseY + ripple;
          ctx.fillStyle = rgbStr(colorsRef.current[i]);
          ctx.beginPath();
          ctx.moveTo(x - 5, dripTop);
          ctx.quadraticCurveTo(x, dripTop + len * 0.6, x, dripTop + len);
          ctx.quadraticCurveTo(x, dripTop + len * 0.6, x + 5, dripTop);
          ctx.closePath();
          ctx.fill();
        });

        // The sheen: a thin lighter stroke traced along the leading edge only, so it
        // reads as wet paint catching light rather than a fixed highlight layer.
        ctx.beginPath();
        for (let x = right; x >= left; x -= step) {
          const ripple =
            RIPPLE_AMP *
            noise2DSigned(x * RIPPLE_FREQ + s.seed, t * RIPPLE_SPEED);
          const y = baseY + ripple;
          if (x === right) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(255,255,255,0.16)";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.restore();
      });

      if (allDone) {
        directionRef.current = null;
        resolveRef.current?.();
        resolveRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    function start(direction: Direction) {
      return new Promise<void>((resolve) => {
        cancelAnimationFrame(rafRef.current);
        resizeCanvas();
        directionRef.current = direction;
        startRef.current = performance.now();
        resolveRef.current = resolve;
        rafRef.current = requestAnimationFrame(draw);
      });
    }

    useImperativeHandle(ref, () => ({
      sweepDown: () => {
        visibleRef.current = true;
        if (wrapRef.current) wrapRef.current.style.display = "block";
        return start("down");
      },
      sweepUp: () =>
        start("up").then(() => {
          visibleRef.current = false;
          if (wrapRef.current) wrapRef.current.style.display = "none";
        }),
    }));

    useEffect(() => {
      const onResize = () => {
        if (visibleRef.current) resizeCanvas();
      };
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(rafRef.current);
      };
    }, []);

    return (
      <div
        ref={wrapRef}
        style={{ display: "none" }}
        className={`fixed inset-0 z-[999999] overflow-hidden ${className}`}
        aria-hidden
      >
        <canvas ref={canvasRef} className="block" />
      </div>
    );
  },
);
