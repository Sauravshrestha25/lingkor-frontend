"use client";

/**
 * A struck bell, synthesised — no audio file.
 *
 * Shipping a real recording would mean licensing a sample we can't verify the rights
 * to, plus a download on a page that already carries a 12 MB film. A bell is also one
 * of the easier instruments to model honestly: unlike a plucked string, its partials
 * are *inharmonic* (not integer multiples of the fundamental) and each one decays at
 * its own rate, which is exactly why a bell shimmers and a sine tone doesn't.
 *
 * Ratios below are in the neighbourhood of a struck bowl's hum/prime/tierce/quint
 * series rather than a Western harmonic series — deliberately slightly "off", because
 * that dissonance is the sound.
 */

const PARTIALS = [
  // ratio, gain, decay seconds
  [1.0, 0.6, 3.6],
  [2.02, 0.34, 2.7],
  [2.99, 0.2, 2.1],
  [4.21, 0.12, 1.5],
  [5.43, 0.07, 1.1],
] as const;

const STORAGE_KEY = "lb-bell-muted";
const MIN_GAP_MS = 260; // rapid row traversal must not machine-gun

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let last = 0;
let muted = false;
let unlocked = false;

/** Read the stored preference once, on first import in the browser. */
if (typeof window !== "undefined") {
  muted = window.localStorage.getItem(STORAGE_KEY) === "1";
}

// Subscribers, so React can read this module as an external store rather than
// copying it into component state inside an effect.
const listeners = new Set<() => void>();

export function subscribeBell(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function isBellMuted() {
  return muted;
}

/** Server render has no preference to read; assume the bell is on. */
export function isBellMutedOnServer() {
  return false;
}

export function setBellMuted(next: boolean) {
  muted = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  }
  listeners.forEach((cb) => cb());
}

/**
 * Browsers refuse to start an AudioContext until the page has had a real user
 * gesture — and hovering does not count as one. So the first click/tap/key anywhere
 * builds the context; until then `playBell` is a silent no-op rather than an error.
 */
export function unlockBell() {
  if (unlocked || typeof window === "undefined") return;
  const start = () => {
    if (unlocked) return;
    unlocked = true;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctx = new AC();
      master = ctx.createGain();
      // Quiet on purpose. This is an accent, not an alert.
      master.gain.value = 0.13;
      master.connect(ctx.destination);
    } catch {
      ctx = null;
    }
    window.removeEventListener("pointerdown", start);
    window.removeEventListener("keydown", start);
  };
  window.addEventListener("pointerdown", start, { once: true });
  window.addEventListener("keydown", start, { once: true });
}

/**
 * Strike the bell. `variant` shifts the fundamental a little so moving down a list
 * doesn't repeat one identical note — closer to passing a row of bells than to
 * clicking the same UI sound five times.
 */
export function playBell(variant = 0) {
  if (muted || !ctx || !master) return;

  const now = performance.now();
  if (now - last < MIN_GAP_MS) return;
  last = now;

  if (ctx.state === "suspended") void ctx.resume();

  const t = ctx.currentTime;
  // Pentatonic-ish steps, so any two rows still sound consonant together.
  const semitones = [0, 3, 5, 7, 10][variant % 5];
  const root = 523.25 * Math.pow(2, semitones / 12);

  for (const [ratio, gain, decay] of PARTIALS) {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = root * ratio;
    // A touch of detune keeps each strike from sounding machine-identical.
    osc.detune.value = (Math.random() - 0.5) * 6;

    // Percussive: near-instant attack, long exponential tail. `setTargetAtTime`
    // decays asymptotically, which is what a struck metal body actually does.
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(gain, t + 0.006);
    env.gain.setTargetAtTime(0, t + 0.006, decay / 5);

    osc.connect(env);
    env.connect(master);
    osc.start(t);
    osc.stop(t + decay);
  }
}
