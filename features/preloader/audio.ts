"use client";

// One track only — the film's own music. It starts with the hero cinematic and just
// keeps looping; there is no separate "site music" it hands off to.
const PRELOADER_MUSIC_SRC = "/music/preloader_music.mp3";

const PRELOADER_VOLUME = 0.34;
const FADE_STEP_MS = 50;
const FADE_DURATION_MS = 1400;
const PRELOADER_FADE_OUT_MS = 700;
const STORAGE_KEY = "lb-site-sound-muted";

let preloaderMusic: HTMLAudioElement | null = null;
let audioEnabled = false;
let muted = false;
let ducked = false;
let duckedVolume = PRELOADER_VOLUME;

// Site sound is silent until the visitor opts in, so the default is muted — only an
// explicit prior "on" ("0" in storage) starts it unmuted.
if (typeof window !== "undefined") {
  muted = window.localStorage.getItem(STORAGE_KEY) !== "0";
}

const listeners = new Set<() => void>();

export function subscribeSiteSound(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function isSiteSoundMuted() {
  return muted;
}

export function isSiteSoundMutedOnServer() {
  return true;
}

export function setSiteSoundMuted(next: boolean) {
  muted = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  }
  if (preloaderMusic) preloaderMusic.muted = next;
  listeners.forEach((cb) => cb());
}

function makeLoop(src: string, volume: number) {
  if (!src || typeof Audio === "undefined") return null;
  const audio = new Audio(src);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = volume;
  audio.muted = muted;
  audio.load();
  return audio;
}

function fade(
  audio: HTMLAudioElement,
  target: number,
  duration = FADE_DURATION_MS,
) {
  const start = audio.volume;
  const steps = Math.max(1, Math.round(duration / FADE_STEP_MS));
  let current = 0;

  const id = window.setInterval(() => {
    current += 1;
    audio.volume = start + (target - start) * (current / steps);
    if (current >= steps) {
      audio.volume = target;
      window.clearInterval(id);
    }
  }, FADE_STEP_MS);
}

function play(audio: HTMLAudioElement | null) {
  if (!audio) return Promise.resolve();
  return audio.play().catch(() => {
    // Placeholder or blocked audio should never break the visual entry.
  });
}

export function startPreloaderSound() {
  audioEnabled = true;
  preloaderMusic ??= makeLoop(PRELOADER_MUSIC_SRC, PRELOADER_VOLUME);
  if (preloaderMusic) {
    preloaderMusic.currentTime = 0;
    preloaderMusic.volume = PRELOADER_VOLUME;
  }
  play(preloaderMusic);
}

export function enterSilently() {
  audioEnabled = false;
  stopAllIntroSound();
}

/**
 * Build and buffer the track ahead of time, muted and paused.
 *
 * `startPreloaderSound()` used to `new Audio()` + `.load()` and then `.play()` in the
 * same tick as the click — Chrome can reject that `play()` with NotAllowedError even
 * inside a genuine gesture, because the resource load was only just kicked off. With
 * the element already created and preloading, the click's `play()` lands on a ready
 * element and is honoured.
 */
export function prewarmIntroSound() {
  if (typeof Audio === "undefined") return;
  preloaderMusic ??= makeLoop(PRELOADER_MUSIC_SRC, PRELOADER_VOLUME);
}

export function fadeOutPreloaderSound(duration = PRELOADER_FADE_OUT_MS) {
  if (!audioEnabled || !preloaderMusic) return;
  fade(preloaderMusic, 0, duration);
  window.setTimeout(() => preloaderMusic?.pause(), duration + 50);
}

/** Duck the (single, looping) track while a section wants its own sound to lead —
 *  e.g. the kora bells — then bring it back with `restoreSiteSound`. */
export function fadeOutSiteSound(duration = 1200) {
  if (!audioEnabled || !preloaderMusic) return;
  ducked = true;
  duckedVolume = preloaderMusic.volume;
  fade(preloaderMusic, 0, duration);
}

export function restoreSiteSound(duration = 1600) {
  if (!audioEnabled || !preloaderMusic || !ducked) return;
  ducked = false;
  fade(preloaderMusic, duckedVolume, duration);
}

export function stopAllIntroSound() {
  preloaderMusic?.pause();
  if (preloaderMusic) preloaderMusic.currentTime = 0;
}
