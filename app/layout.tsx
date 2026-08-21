import type { Metadata } from "next";
import type { ReactNode } from "react";
import localfont from "next/font/local";
import "./globals.css";
import Navbar from "@/features/navigation/components/Navbar";
import Preloader from "@/features/preloader/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import WebxSignature from "@/components/WebxSignature";

const barlow = localfont({
  variable: "--font-barlow",
  src: [
    {
      path: "../public/fonts/BarlowCondensed-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/BarlowCondensed-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
});

const yagpo = localfont({
  src: "../public/fonts/YagpoTibetanUni-x3jnj.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-yagpo",
});

const hasweny = localfont({
  src: "../public/fonts/Hasweny-XGe69.otf",
  weight: "400",
  style: "normal",
  variable: "--font-hasweny",
});

export const metadata: Metadata = {
  title: "Lingkor — Boudha",
  description:
    "Rest in the spirit of Mustang. A hotel beneath the stupa, in Boudha, Kathmandu.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${hasweny.variable} ${yagpo.variable} ${barlow.variable}`}
    >
      <body className="flex min-h-svh flex-col bg-canvas text-ink">
        <WebxSignature />
        <SmoothScroll />
        {/* Sitewide, and mounted in the layout on purpose.
            The root layout is not re-rendered by client navigation, so the intro cannot
            replay when you come back to a route you have already visited — which is
            exactly what happened while it lived in `page.tsx`. It plays once per
            session (see ONCE_PER_SESSION) and holds the entrance animations until it is
            done (see features/preloader/gate.ts). */}
        <Preloader />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
