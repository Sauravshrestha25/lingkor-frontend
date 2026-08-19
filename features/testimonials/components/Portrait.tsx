import Image from "next/image";
import { Label } from "@/components/ui";
import type { Voice } from "../types";

/**
 * The portrait block on a testimonial card.
 *
 * ⚠️ No guest photography exists — the hotel has not opened. Until consented guest
 * portraits exist, cards use atmospheric photographs of the place rather than faces.
 * That keeps the layout photographic without making a stranger appear to endorse the
 * hotel.
 *
 * So the fallback is a wordmark on the space's own element colour: a real image block
 * at the right proportion, unmistakably not a photograph of a person. Set `image` on a
 * `Voice` and the photograph takes over with no other change.
 */
export function Portrait({ voice }: { voice: Voice }) {
  if (voice.image) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={voice.image}
          alt={voice.imageAlt ?? voice.name}
          fill
          sizes="(max-width: 640px) 82vw, (max-width: 1024px) 54vw, 30vw"
          draggable={false}
          className="select-none object-cover"
        />
      </div>
    );
  }

  // The space they stayed in, not the guest's initials: the placeholder names are all
  // identical, so initials would give five of the same tile.
  const mark = voice.room ?? "Lingkor";

  return (
    <div
      className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-ink/15"
    >
      <Image
        src="/images/art/knot-white.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 640px) 82vw, (max-width: 1024px) 54vw, 30vw"
        className="pointer-events-none object-cover opacity-15"
      />
      <span className="font-display relative select-none text-[clamp(2rem,3.4vw,3rem)] leading-none opacity-90">
        {mark}
      </span>
      <Label className="absolute bottom-3 left-0 right-0 text-center opacity-50">
        Portrait to come
      </Label>
    </div>
  );
}
