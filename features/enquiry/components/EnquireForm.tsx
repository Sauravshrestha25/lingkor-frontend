"use client";

import { useState } from "react";
import { Button } from "@/components/shared/button";
import { Label } from "@/components/ui";

const TO = "phuntsokg8808@gmail.com";

const field =
  "peer w-full border-b border-ink/25 bg-transparent py-3 text-body outline-none transition-colors duration-300 placeholder:text-ink/30 focus:border-ink";

/**
 * There is no booking engine and no backend (REQUIREMENTS.md §8) — so submitting
 * builds a `mailto:` with the form's contents pre-filled into the body and hands the
 * visitor to their own mail client. That is a real, working path today; it is not a
 * simulation of one. Replace `onSubmit` with a real POST once there's somewhere to
 * send it, and the fields below don't need to change.
 */
export default function EnquireForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const dates = data.get("dates") as string;
    const guests = data.get("guests") as string;
    const message = data.get("message") as string;

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      dates && `Dates: ${dates}`,
      guests && `Guests: ${guests}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const mailto = `mailto:${TO}?subject=${encodeURIComponent(
      "Enquiry — Lingkor Boudha",
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-[38rem]">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
        <label className="block">
          <Label className="opacity-50">Name</Label>
          <input name="name" type="text" required className={`${field} mt-3`} />
        </label>

        <label className="block">
          <Label className="opacity-50">Email</Label>
          <input name="email" type="email" required className={`${field} mt-3`} />
        </label>

        <label className="block">
          <Label className="opacity-50">Dates</Label>
          <input
            name="dates"
            type="text"
            placeholder="e.g. 12–16 March"
            className={`${field} mt-3`}
          />
        </label>

        <label className="block">
          <Label className="opacity-50">Guests</Label>
          <input name="guests" type="text" placeholder="2" className={`${field} mt-3`} />
        </label>

        <label className="col-span-full block">
          <Label className="opacity-50">Message</Label>
          <textarea
            name="message"
            rows={4}
            placeholder="Tell us anything else — which room caught your eye, how you found us."
            className={`${field} mt-3 resize-none`}
          />
        </label>
      </div>

      <Button
        type="submit"
        className="text-label mt-10 cursor-pointer border border-ink px-10 py-3 uppercase transition-colors duration-300 hover:bg-ink hover:text-canvas"
      >
        Send enquiry
      </Button>

      <p className="text-label mt-4 uppercase opacity-40" aria-live="polite">
        {sent
          ? "Opening your mail client — send it from there."
          : "Opens as an email. We answer every one ourselves."}
      </p>
    </form>
  );
}
