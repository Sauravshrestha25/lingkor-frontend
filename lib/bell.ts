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

const RESONANT_PARTIALS = [
  // ratio, gain, decay seconds
  [0.5, 0.2, 7.8],
  [1.0, 0.72, 8.8],
  [1.51, 0.42, 7.1],
  [2.03, 0.35, 6.4],
  [2.74, 0.24, 5.2],
  [3.76, 0.17, 4.4],
  [5.41, 0.11, 3.2],
  [7.18, 0.06, 2.2],
] as const;

const STORAGE_KEY = "lb-bell-muted";
const MIN_GAP_MS = 260; // rapid row traversal must not machine-gun

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let last = 0;
let muted = false;
let unlocked = false;
let listening = false;

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
  if (unlocked || listening || typeof window === "undefined") return;
  listening = true;

  const stop = () => {
    listening = false;
    window.removeEventListener("pointerdown", start);
    window.removeEventListener("keydown", start);
  };

  const start = () => {
    if (unlocked) {
      stop();
      return;
    }
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
    stop();
  };
  window.addEventListener("pointerdown", start, { once: true });
  window.addEventListener("keydown", start, { once: true });
}

/**
 * Strike the bell. `variant` shifts the fundamental a little so moving down a list
 * doesn't repeat one identical note — closer to passing a row of bells than to
 * clicking the same UI sound five times.
 */
export function playBell(variant = 0, decayScale = 1) {
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
    const scaledDecay = decay * decayScale;

    osc.type = "sine";
    osc.frequency.value = root * ratio;
    // A touch of detune keeps each strike from sounding machine-identical.
    osc.detune.value = (Math.random() - 0.5) * 6;

    // Percussive: near-instant attack, long exponential tail. `setTargetAtTime`
    // decays asymptotically, which is what a struck metal body actually does.
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(gain, t + 0.006);
    env.gain.setTargetAtTime(0, t + 0.006, scaledDecay / 5);

    osc.connect(env);
    env.connect(master);
    osc.start(t);
    osc.stop(t + scaledDecay);
  }
}

export function playResonantBell(variant = 0) {
  if (muted || !ctx || !master) return;

  const now = performance.now();
  if (now - last < MIN_GAP_MS) return;
  last = now;

  if (ctx.state === "suspended") void ctx.resume();

  const t = ctx.currentTime;
  const semitones = [-2, 0, 3, 5, 7][variant % 5];
  const root = 392 * Math.pow(2, semitones / 12);
  const dry = ctx.createGain();
  const delay = ctx.createDelay(1.2);
  const feedback = ctx.createGain();
  const wet = ctx.createGain();

  dry.gain.value = 1;
  delay.delayTime.value = 0.21;
  feedback.gain.value = 0.36;
  wet.gain.value = 0.28;

  dry.connect(master);
  dry.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(master);

  for (const [ratio, gain, decay] of RESONANT_PARTIALS) {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = root * ratio;
    osc.detune.value = (Math.random() - 0.5) * 9;

    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(gain, t + 0.012);
    env.gain.setTargetAtTime(0, t + 0.018, decay / 4.6);

    osc.connect(env);
    env.connect(dry);
    osc.start(t);
    osc.stop(t + decay);
  }

  const noiseLength = Math.round(ctx.sampleRate * 0.035);
  const buffer = ctx.createBuffer(1, noiseLength, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < noiseLength; i += 1) {
    const fade = 1 - i / noiseLength;
    data[i] = (Math.random() * 2 - 1) * fade;
  }

  const strike = ctx.createBufferSource();
  const strikeFilter = ctx.createBiquadFilter();
  const strikeEnv = ctx.createGain();

  strike.buffer = buffer;
  strikeFilter.type = "bandpass";
  strikeFilter.frequency.value = root * 8.2;
  strikeFilter.Q.value = 5.5;
  strikeEnv.gain.setValueAtTime(0.15, t);
  strikeEnv.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

  strike.connect(strikeFilter);
  strikeFilter.connect(strikeEnv);
  strikeEnv.connect(dry);
  strike.start(t);
  strike.stop(t + 0.09);

  window.setTimeout(() => {
    dry.disconnect();
    delay.disconnect();
    feedback.disconnect();
    wet.disconnect();
  }, 10_000);
}
