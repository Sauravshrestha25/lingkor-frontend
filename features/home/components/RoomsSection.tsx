import RoomsRail from "@/features/rooms/components/RoomsRail";
import { Rise, SplitLines } from "@/components/anim";
import { Label } from "@/components/ui";

export function RoomsSection() {
  return (
    <>
      {/* ── Rooms ───────────────────────────────────────────────────────── */}
      {/* No `home-knot-gutters` here, by request: the rooms rail runs without the knot
          band down its edges. Spaces keeps it. */}
      <section
        id="rooms"
        className="relative w-full overflow-hidden border-t border-[#a8a8a8]/20 bg-canvas section-y"
      >
        <div className="relative z-10 mx-auto mb-16 w-full shell-max shell-px">
          <div className="flex flex-col gap-8 items-center justify-center mx-auto w-full">
            <div className="flex flex-col items-center justify-center">
              <Rise>
                <Label className="text-2xl font-sub font-black uppercase  ">
                  Our Rooms
                </Label>
              </Rise>
              <SplitLines
                lines={["Twenty-odd ways", "to sleep in Mustang"]}
                className="font-display mt-8 text-center text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.98]"
              />
            </div>
            <Rise delay={200} className="lg:max-w-lg">
              {/* TODO: real room types, sizes and rates — see CONTENT.md. */}
              <p className="text-body text-center">
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
