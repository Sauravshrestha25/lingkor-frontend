import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="relative h-screen w-full overflow-hidden flex items-center justify-center text-white">
      <div className="absolute inset-0">
        <video
          src="/boudha3.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-[1.15]"
        />

        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <Image src="/logo-white.png" alt="logo" width={120} height={120} />

        <h1 className="mt-2 text-[8vw] font-logo leading-none">Coming Soon</h1>

        <div className="flex items-center gap-4">
          <span>Under Construction by</span>
          <Link target="_blank" href={"https://webxnepal.com/"}>
            <img src="/webx-logo.jpg" alt="webx-logo" className="w-20 h-auto" />
          </Link>
        </div>
      </div>
    </main>
  );
}
