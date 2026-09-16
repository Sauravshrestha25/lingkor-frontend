import RoomsRail from "@/features/rooms/components/RoomsRail";
import { Rise, SplitChars } from "@/components/anim";
import { Label } from "@/components/ui";

export function RoomsSection() {
  return (
    <>
      {/* ── Rooms ───────────────────────────────────────────────────────── */}
      <section
        id="rooms"
        className="relative w-full overflow-hidden bg-surface section-y"
      >
        <div className="relative z-10 mx-auto mb-16 w-full shell-max shell-px">
          <div className="flex flex-col gap-8 items-center justify-center mx-auto w-full">
            <div className="flex w-full max-w-3xl flex-col items-center justify-center">
              <Rise>
                <Label className="text-2xl font-sub font-black uppercase  ">
                  Our Rooms
                </Label>
              </Rise>
              <SplitChars
                lines={["Twenty-odd ways to sleep in Mustang"]}
                className="font-display mt-8 w-full text-center text-[clamp(1.25rem,2.75vw,2.5rem)] leading-[0.98]"
              />
            </div>
            <Rise delay={200} className="lg:max-w-2xl">
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
