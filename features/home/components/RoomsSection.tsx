import RoomsRail from "@/features/rooms/components/RoomsRail";
import { Rise, SplitLines } from "@/components/anim";
import { Label } from "@/components/ui";

export function RoomsSection() {
  return (
    <>
      {/* ── Rooms ───────────────────────────────────────────────────────── */}
      <section id="rooms" className="w-full bg-canvas section-y">
        <div className="mx-auto mb-16 w-full shell-max shell-px">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Rise>
                <Label className="opacity-60">Rooms</Label>
              </Rise>
              <SplitLines
                lines={["Twenty-odd ways", "to sleep in Mustang"]}
                className="font-display mt-8 text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.98]"
              />
            </div>
            <Rise delay={200} className="lg:max-w-lg">
              {/* TODO: real room types, sizes and rates — see CONTENT.md. */}
              <p className="text-body">
                Each one carries a piece of Mustang: hand-woven runners, clouds
                painted on the cabinets, and windows that hold the stupa.
              </p>
            </Rise>
          </div>
        </div>

        <RoomsRail />
      </section>
    </>
  );
}
