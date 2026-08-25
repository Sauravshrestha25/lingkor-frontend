"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/shared/button";
import { setBellMuted } from "@/lib/bell";
import {
  isSiteSoundMuted,
  isSiteSoundMutedOnServer,
  setSiteSoundMuted,
  subscribeSiteSound,
} from "../audio";
import { isIntroActive, subscribeIntroActive } from "../gate";

export function SoundToggle() {
  const muted = useSyncExternalStore(
    subscribeSiteSound,
    isSiteSoundMuted,
    isSiteSoundMutedOnServer,
  );
  // Hidden for the run of the preloader — the entry screen already asks With Sound
  // or Silent Entry, and a second, floating control saying the same thing over the
  // cinematic that follows is a control fighting a choice already made.
  //
  // `() => false` as the server snapshot: SSR always says "not active" so this
  // button is in the initial HTML, and `claimIntro()` — which runs in a layout
  // effect, before paint — corrects it to hidden before anyone sees the flash.
  const introActive = useSyncExternalStore(
    subscribeIntroActive,
    isIntroActive,
    () => false,
  );
  const Icon = muted ? VolumeX : Volume2;

  useEffect(() => {
    setBellMuted(muted);
  }, [muted]);

  if (introActive) return null;

  return (
    <Button
      type="button"
      onClick={() => {
        const next = !muted;
        setSiteSoundMuted(next);
      }}
      aria-label={muted ? "Unmute sound" : "Mute sound"}
      aria-pressed={muted}
      className="fixed right-5 bottom-5 z-[120] grid size-11 cursor-pointer place-items-center rounded-full border border-white/45 bg-ink/72 text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-md transition-colors duration-300 hover:bg-ink sm:right-8 sm:bottom-8"
      hoverScale={1.04}
      tapScale={0.94}
    >
      <Icon className="size-4" aria-hidden />
    </Button>
  );
}
