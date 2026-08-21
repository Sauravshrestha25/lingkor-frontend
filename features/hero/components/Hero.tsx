"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, reduced } from "@/lib/gsap";

import { SplitChars } from "@/components/anim";
import { Rise } from "@/components/anim";
import { Button } from "@/components/shared/button";

/**
 * The lobby, looking out through the main doors.
 *
 * **Interior, not the stupa.** The written brief opens the homepage on Mustang geology
 * dissolving into Boudhanath; that is deliberately superseded. You are inside the
 * building from the first frame, and everything after it is the country the building
 * came from — which is the point of the page: *stay here because it feels like
 * Mustang*, not *go to Mustang*.
 *
 * `Lobby_to_MainDoor` specifically, of the three lobby renders: it looks *outward*, so
 * the building holds you and the world is the thing beyond the glass. The reception
 * view puts a desk between you and the room, and the sofa view has no exit in it.
 *
 * **The headline is the client's, not ours.** `6. Graphics/Color signboard.jpg` — the
 * sign that will stand outside the building — is the wordmark over a wall painted in
 * the five element colours, with one line under it: *"Rest in the Spirit of Mustang"*.
 * That is the sentence the hotel chose to greet people with. It was previously set here
 * as a 11px label under an invented headline ("Mustang brought down to the stupa"),
 * which put our words above theirs in the first thing anyone reads. Note the capital
 * *S* — the sign has it, and we were lower-casing it.
 *
 * **Centred, not bottom-left.** Every other hero on the site is bottom-weighted, and so
 * was this. On the signboard the type sits centred with a great deal of wall around it,
 * and the brief asks the site to feel "spacious, real feeling of space, nothing tight".
 * Centre with air is that; a caption in the bottom corner is not.
 *
 * **It breathes before you touch it.** A very slow, continuous scale runs whether or not
 * you scroll — 24 seconds one way, then back. The brief asks for "like a dream", and a
 * photograph that is perfectly still reads as a screenshot. Scroll still drives the
 * separate recede, so the two compose: the drift is ambient, the recede is yours.
 *
 * This was a looping video, and the brief does want film here — Mustang geology
 * dissolving into the stupa, with wind (REQUIREMENTS.md §8). The preloader tells that
 * story in stills; the footage we had was ordinary drone work and 12 MB of it said less
 * than one frame does. When the real film exists it goes back, and the type can stay as
 * it is.
 *
 * The preloader ends on this exact frame, so the handoff is a match, not a cut.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const media = section?.querySelector("[data-media]");
    if (!section || !media || reduced()) return;

    // The ambient drift. Slow enough that it is never caught moving — you only notice
    // that the frame is not the same as it was.
    const breathe = gsap.to(media, {
      scale: 1.12,
      duration: 24,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    // The recede, on scroll. Separate tween on a wrapper so it cannot fight the scale
    // above: two tweens writing `scale` on one element is a race, and the loser wins
    // at random frame boundaries.
    const recede = gsap.to(section.querySelector("[data-recede]"), {
      yPercent: -4,
      opacity: 0.5,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      breathe.kill();
      recede.scrollTrigger?.kill();
      recede.kill();
    };
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-svh w-full overflow-hidden bg-ink"
    >
      <div data-recede className="absolute inset-0 will-change-transform">
        <div data-media className="absolute inset-0 will-change-transform">
          {/* `preload` (Next 16 renamed this from `priority`) because it is the LCP
              element — the first full-viewport thing anyone sees.

              Note: the preloader's match-cut no longer applies. It used to end on the
              same Boudha frame this showed, so the handoff was seamless; it is
              commented out of the page, and if it comes back its last frame has to
              change to this one or the two will cross-fade between subjects. */}
          <Image
            src="/images/spaces/lobby.png"
            alt="The lobby, looking out through the main doors"
            fill
            sizes="100vw"
            preload
            className="object-cover scale-105"
          />
        </div>
      </div>

      {/* Bottom-weighted again, and lighter. The old flat `ink/45` was tuned for a
          dark stupa at night; on a bright interior it reads as a grey veil over the
          whole room. This keeps the ceiling clear and puts the weight where the type
          sits. */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/50 via-ink/55 to-ink/50" />

      <div className="h-screen w-full flex flex-col items-center justify-center space-y-3 px-6 text-center text-space">
        <div className="flex flex-col items-center justify-center">
          <Rise>
            <p className="text-xl font-sub uppercase  pb-8">
              Mustang to Boudha
            </p>
          </Rise>

          {/* The client's own line, at the size they gave it. */}
          <SplitChars
            lines={["Rest in the Spirit", "of Mustang"]}
            delay={220}
            className="font-display mt-8 text-[clamp(2.75rem,7.5vw,7rem)] uppercase leading-[0.95]"
          />

          {/* The one commercial action on the page, and it is above the fold.
              Everything else here asks the reader to keep scrolling; a hotel homepage
              needs at least one thing that asks them to get in touch. It deliberately
              does not say "Book" — there is no engine, no rates and no availability
              behind it yet, and a button that cannot do what it says is worse than no
              button. See CONTENT.md for what is still missing. */}
          {/* `Button asChild` renders the anchor while keeping the shared press and
              hover behaviour, so the one call to action on the page reacts the same way
              as every other control. It stays an `<a>` because it navigates. */}
          <Rise delay={520} className="mt-12">
            <Button asChild hoverScale={1.03} tapScale={0.97}>
              <a
                href="#enquire"
                className="text-label text-ink inline-block border border-space/50 px-8 py-4 uppercase transition-colors duration-500 ease-brand bg-space hover:bg-space/80 hover:text-ink"
              >
                Enquire about a stay
              </a>
            </Button>
          </Rise>
        </div>
      </div>

      {/* Scroll cue, on the centre line rather than in a corner. The rule travels down
          its own track on a loop — a hint, not an instruction. */}
      <a
        href="#about"
        aria-label="Scroll to the next section"
        className="group absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-space"
      >
        <span className="text-xl font-sub uppercase  transition-opacity duration-300 group-hover:opacity-100">
          Scroll
        </span>
        <span
          aria-hidden="true"
          className="relative block h-12 w-px overflow-hidden bg-space/25"
        >
          <span className="hero-cue absolute inset-x-0 top-0 block h-4 bg-space/90" />
        </span>
      </a>
    </section>
  );
}
