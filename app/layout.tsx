import type { Metadata } from "next";
import type { ReactNode } from "react";
import localfont from "next/font/local";
import "./globals.css";
import Navbar from "@/features/navigation/components/Navbar";
import Preloader from "@/features/preloader/components/Preloader";
import { SoundToggle } from "@/features/preloader/components/SoundToggle";
import SmoothScroll from "@/components/SmoothScroll";
import WebxSignature from "@/components/WebxSignature";
import {
  TransitionProvider,
  // PageTransitionOverlay,
} from "@/features/transition";
import { WhiteLogoPageTransition } from "@/features/transition/components/WhiteLogoPageTransition";

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
  icons: {
    icon: [
      { url: "/Logo/logo.svg", type: "image/svg+xml" },
      {
        url: "/Logo/logo-white.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${hasweny.variable} ${yagpo.variable} ${barlow.variable}`}
    >
      <body className="flex min-h-svh flex-col bg-canvas text-ink">
        <TransitionProvider>
          <WebxSignature />
          <SmoothScroll />
          <Preloader />
          <SoundToggle />
          {/* <PageTransitionOverlay /> */}
          <WhiteLogoPageTransition />
          <Navbar />
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}
