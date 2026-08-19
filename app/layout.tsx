import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Barlow_Condensed } from "next/font/google";
import localfont from "next/font/local";
import "./globals.css";
import Navbar from "@/features/navigation/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import WebxSignature from "@/components/WebxSignature";

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  weight: ["300", "400"],
  subsets: ["latin"],
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
        <Navbar />
        {children}
      </body>
    </html>
  );
}
