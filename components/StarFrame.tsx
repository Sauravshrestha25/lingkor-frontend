import type { ReactNode } from "react";
import { Astroid } from "lucide-react";

/**
 * A white frame with an astroid seated on its top edge.
 *
 * The astroid does not sit *on top of* the border — it **interrupts** it. The top rule
 * is drawn as two segments with a gap, and the mark sits in the gap, so the frame reads
 * as one continuous line that opens to let it through.
 *
 * The obvious alternative — one unbroken border with the icon over it on an opaque
 * backing — needs that backing to match whatever is behind the card *exactly*. On this
 * site a card can sit on the off-white ground, on ink, or on any of the five element
 * fields, so there is no single colour that works. Two segments and a gap has nothing
 * behind the mark to hide, so it is ground-independent by construction.
 *
 * White throughout, deliberately: this is the premium frame, and it holds its colour
 * whatever it is laid over rather than inheriting the card's type colour.
 */
export function StarFrame({
  children,
  className = "",
  /** Inset between the frame and its contents. */
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div className={`relative text-white ${className}`}>
      {/* Top rule, in two halves, with the astroid between them. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center"
      >
        <span className="h-px flex-1 bg-white/70" />
        <Astroid className="mx-2 h-5 w-5 shrink-0 text-white" strokeWidth={1.5} />
        <span className="h-px flex-1 bg-white/70" />
      </div>

      {/* The other three sides. Drawn separately so the top can carry the gap. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 border-x border-b border-white/70"
      />

      <div className={padded ? "p-3 pt-6 lg:p-4 lg:pt-7" : ""}>{children}</div>
    </div>
  );
}
