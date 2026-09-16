import { Rise, SplitChars } from "./anim";
import { Label } from "./ui";

/**
 * The opening of every route that isn't the homepage.
 *
 * Interior pages need a shared shape or the site stops feeling like one site — but
 * the shape has to leave room at the top, because the navbar is fixed and overlays
 * whatever is beneath it. Hence the deep top padding rather than a spacer element.
 */
export default function PageHeader({
  label,
  lines,
  intro,
  tone = "canvas",
  align = "left",
}: {
  label: string;
  /** One array entry per rendered line — the reveal splits on these. */
  lines: string[];
  intro?: string;
  tone?: "canvas" | "sand" | "ink";
  align?: "left" | "center";
}) {
  const ground =
    tone === "ink"
      ? "bg-ink text-space"
      : tone === "sand"
        ? "bg-sand text-ink"
        : "bg-canvas text-ink";
  const centered = align === "center";

  return (
    <header className={`w-full ${ground} pt-40 pb-20 lg:pt-52 lg:pb-28`}>
      <div
        className={`mx-auto w-full shell-max shell-px ${centered ? "flex flex-col items-center text-center" : ""}`}
      >
        <Rise>
          <Label className="opacity-60">{label}</Label>
        </Rise>

        <SplitChars
          lines={lines}
          delay={120}
          className={`font-display mt-8 leading-[0.95] ${
            centered
              ? "text-[clamp(1.75rem,4vw,3.5rem)]"
              : "text-[clamp(2.5rem,6.5vw,6rem)]"
          }`}
        />

        {intro && (
          <Rise delay={260} className="mt-12">
            <p className={`text-body opacity-80 ${centered ? "max-w-[44ch]" : "max-w-[52ch]"}`}>{intro}</p>
          </Rise>
        )}
      </div>
    </header>
  );
}
