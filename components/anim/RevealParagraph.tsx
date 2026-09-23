"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap, reduced } from "../../lib/gsap";

export function RevealParagraph({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll<HTMLElement>("[data-word]");

    if (reduced()) {
      gsap.set(words, { opacity: 1 });
      return;
    }

    const tween = gsap.fromTo(
      words,
      { opacity: 0.18 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.5,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "bottom 55%",
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const words = text.split(" ");

  return (
    <p className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span data-word className="inline-block">
            {word}
          </span>

          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </p>
  );
}
