import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * The shadcn/animate-ui class merger, at the path `components.json` points its
 * `utils` alias at. Twenty-two files in `components/animate-ui/` import this and it
 * did not exist, which is what was failing the typecheck.
 *
 * `twMerge` on top of `clsx` is not decoration: it resolves *conflicting* Tailwind
 * classes by keeping the last one, so `cn("p-2", "p-6")` gives `p-6` rather than both.
 * A plain join leaves both in the string and lets CSS source order decide, which is
 * why overriding a vendored component's padding appears to do nothing at random.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
