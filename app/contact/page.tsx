import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Footer from "@/features/navigation/components/Footer";
import EnquireForm from "@/features/enquiry/components/EnquireForm";
import { Rise } from "@/components/anim";
import { Label } from "@/components/ui";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact — Lingkor",
  description:
    "Write to Lingkor, Boudha — Kathmandu, Nepal. Enquiries, dates and directions.",
};

const ROUTE = [
  {
    place: "Tribhuvan International",
    leg: "By air",
    detail:
      "Kathmandu's only airport, and the closest one to the stupa — Boudha is on the same side of the city.",
  },
  {
    place: "The ring road",
    leg: "By taxi",
    detail:
      "North-east across town. From Thamel or Durbar Square it is one fare and no changes.",
  },
  {
    place: "Boudhanath",
    leg: "On foot",
    detail:
      "The last stretch is the kora itself: through the gate, around the dome, clockwise like everyone else.",
  },
];

export default function ContactPage() {
  return (
    <main className="w-full">
      <PageHeader
        label="Contact"
        lines={["Write to us,", "and we will", "hold a room"]}
        intro="Tell us when you would like to come and how long you can stay. We answer every message ourselves."
      />

      <section className="w-full bg-canvas pb-28 lg:pb-40">
        <div className="mx-auto w-full shell-max shell-px">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <Rise className="lg:col-span-6 lg:order-2">
              <EnquireForm />
            </Rise>

            <div className="lg:col-span-4 lg:order-1">
              <Rise>
                <Label className="opacity-50">Direct</Label>
                <address className="text-body mt-6 space-y-3 not-italic">
                  {/* TODO: street address, and a hotel line rather than a personal
                      one — none supplied. See CONTENT.md. */}
                  <p className="opacity-75">{CONTACT.address}</p>
                  <p>
                    <a
                      href={CONTACT.phoneHref}
                      className="underline decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-transparent"
                    >
                      {CONTACT.phone}
                    </a>
                  </p>
                  <p>
                    <a
                      href={`mailto:${CONTACT.email}?subject=Enquiry%20—%20Lingkor%20Boudha`}
                      className="underline decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-transparent"
                    >
                      {CONTACT.email}
                    </a>
                  </p>
                </address>
              </Rise>

              <Rise delay={160} className="mt-14">
                <Label className="opacity-50">Getting here</Label>
                <ol className="mt-6">
                  {ROUTE.map((stop, i) => (
                    <li key={stop.place} className="flex gap-5 pb-7 last:pb-0">
                      <div className="relative flex w-3 shrink-0 justify-center">
                        <span
                          aria-hidden="true"
                          className={`absolute top-3 h-full w-px bg-ink/20 ${
                            i === ROUTE.length - 1 ? "hidden" : ""
                          }`}
                        />
                        <span
                          aria-hidden="true"
                          className="relative mt-2 h-1.5 w-1.5 rounded-full bg-ink/60"
                        />
                      </div>
                      <div>
                        <div className="flex items-baseline gap-3">
                          <span className="font-display text-[1.375rem] leading-none">
                            {stop.place}
                          </span>
                          <Label className="opacity-40">{stop.leg}</Label>
                        </div>
                        <p className="text-body mt-2 opacity-70">{stop.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Rise>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
