import Image from "next/image";
import Link from "next/link";
import { SparklesCore } from "../components/SparklesCore";

export default function Page() {
  return (
    <main className="relative min-h-svh w-full overflow-hidden text-white">
      <div className="absolute inset-0">
        <video
          src="/boudha3.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full scale-110 object-cover sm:scale-125 lg:scale-140"
        />

        <div className="absolute inset-0 bg-[#cc9933]/90" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl flex-col items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex w-full flex-1 flex-col items-center justify-center py-8 sm:py-10">
          <Image
            src="/logo-white.png"
            alt="Lingkor Boudha"
            width={500}
            height={300}
            priority
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 500px"
            className="h-auto w-[min(90vw,500px)] object-contain"
          />

          <h1 className="mt-2 text-center font-logo text-[clamp(2.75rem,7vw,5rem)] leading-none">
            Coming Soon...
          </h1>
        </div>

        <div className="flex shrink-0 flex-col items-center justify-center pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:flex-row sm:gap-1 sm:pb-8">
          <span className="text-center text-sm font-medium sm:text-base">
            Under Development by
          </span>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://webxnepal.com/"
            className="relative flex h-12 w-28 items-center justify-center sm:h-14 sm:w-32"
            aria-label="Visit WebX Nepal"
          >
            <SparklesCore
              className="pointer-events-none absolute inset-0"
              minSize={0.5}
              maxSize={1.4}
              speed={0.7}
              particleDensity={180}
            />
            <Image
              src="/webx-white-logo.svg"
              alt="webx-logo"
              height={30}
              width={60}
              className="relative z-10 h-auto w-16 sm:w-20"
            />
          </Link>
        </div>
      </div>
    </main>
  );
}
