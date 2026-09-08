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

// Lives inline in the navbar beside Enquire — not a floating control. The navbar
// already hides its right cluster for the run of the hero cinematic, so there is
// no separate intro-active guard here.
export function SoundToggle({ className = "" }: { className?: string }) {
  const muted = useSyncExternalStore(
    subscribeSiteSound,
    isSiteSoundMuted,
    isSiteSoundMutedOnServer,
  );
  const Icon = muted ? VolumeX : Volume2;

  useEffect(() => {
    setBellMuted(muted);
  }, [muted]);

  return (
    <Button
      type="button"
      onClick={() => setSiteSoundMuted(!muted)}
      aria-label={muted ? "Turn music on" : "Turn music off"}
      aria-pressed={!muted}
      className={`text-label flex cursor-pointer items-center gap-2 uppercase transition-colors duration-500 ${className}`}
      hoverScale={1.01}
      tapScale={0.99}
    >
      <Icon className="size-4" aria-hidden />
    </Button>
  );
}
