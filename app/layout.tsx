import type { Metadata } from "next";
import type { ReactNode } from "react";
import localfont from "next/font/local";
import { Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/features/navigation/components/Navbar";
import { SoundToggle } from "@/features/preloader/components/SoundToggle";
import SmoothScroll from "@/components/SmoothScroll";
import WebxSignature from "@/components/WebxSignature";
import {
  TransitionProvider,
  // PageTransitionOverlay,
} from "@/features/transition";
import { WhiteLogoPageTransition } from "@/features/transition/components/WhiteLogoPageTransition";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
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
      className={`${hasweny.variable} ${lato.variable}`}
    >
      <body className="flex min-h-svh flex-col bg-canvas text-ink">
        <TransitionProvider>
          <WebxSignature />
          <SmoothScroll />
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
