import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowDown } from "lucide-react";
import { Photo } from "@/components/media/Photo";
import Footer from "@/features/navigation/components/Footer";
import EnquireForm from "@/features/enquiry/components/EnquireForm";
import { ROOMS, roomBySlug } from "@/features/rooms/data/rooms";
import { RoomPhoto } from "@/features/rooms/components/RoomPhoto";
import { Button } from "@/components/shared/button";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ROOMS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const room = roomBySlug((await params).slug);
  if (!room) notFound();
  return {
    title: `${room.name} — Rooms at Lingkor`,
    description: room.description,
    openGraph: { title: `${room.name} — Lingkor`, description: room.description, images: [`/images/rooms/${room.id}.webp`] },
  };
}

export default async function RoomPage({ params }: Props) {
  const room = roomBySlug((await params).slug);
  if (!room) notFound();
  const nextRoom = ROOMS[(ROOMS.indexOf(room) + 1) % ROOMS.length];

  return (
    <main className="w-full bg-canvas text-ink">
      <header className="shell-px pt-32 pb-9 sm:pt-36 md:pb-12">
        <nav aria-label="Room types" className="flex flex-wrap justify-center gap-x-7 gap-y-4">
          {ROOMS.map((item) => (
            <Link key={item.slug} href={`/rooms/${item.slug}`} aria-current={item.slug === room.slug ? "page" : undefined} className={`text-label border-b pb-2 uppercase transition-colors hover:text-brick ${item.slug === room.slug ? "border-brick text-brick" : "border-transparent text-ink/55"}`}>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="mt-12 text-center md:mt-16">
          <p className="text-label uppercase text-ink/55">Stay at Lingkor · Boudha</p>
          <h1 className="mt-6 font-display text-[clamp(3.5rem,8vw,7rem)] leading-none">{room.name}</h1>
          <p className="mt-6 text-label uppercase text-ink/60">{room.size} <span aria-hidden="true" className="mx-3">/</span> {room.note}</p>
        </div>
      </header>

      <section aria-label={`${room.name} photograph`} className="px-4 md:shell-px">
        <RoomPhoto key={room.slug} room={room} />
        <div className="mt-5 flex items-center justify-between gap-6">
          <span className="text-label uppercase text-ink/55">Lingkor / {room.name}</span>
          <Button asChild><a href="#room-details" className="inline-flex min-h-11 items-center gap-3 text-label uppercase hover:text-brick">Discover the room <ArrowDown aria-hidden="true" className="size-4" /></a></Button>
        </div>
      </section>

      <section id="room-details" className="shell-px section-y scroll-mt-28">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="text-label uppercase text-brick">The {room.name}</p>
            <h2 className="mt-7 max-w-[16ch] font-display text-section">{room.headline}</h2>
          </div>
          <div>
            <p className="text-body leading-relaxed text-ink/75">{room.description}</p>
            <dl className="mt-9 border-t border-ink/15">
              <div className="flex justify-between gap-6 border-b border-ink/15 py-5"><dt className="text-label uppercase text-ink/55">Occupancy</dt><dd className="text-sm">{room.size}</dd></div>
              <div className="flex justify-between gap-6 border-b border-ink/15 py-5"><dt className="text-label uppercase text-ink/55">Character</dt><dd className="text-right text-sm">{room.note}</dd></div>
            </dl>
            <Button asChild><a href="#room-enquiry" className="mt-9 inline-flex min-h-14 items-center justify-center gap-5 text-label uppercase"><span className="text-trim">Enquire about this room</span><ArrowRight aria-hidden="true" className="size-4" /></a></Button>
          </div>
        </div>
      </section>

      <section id="room-enquiry" className="scroll-mt-24 bg-surface shell-px section-y">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="text-label uppercase text-brick">Make yourself at home</p>
            <h2 className="mt-7 font-display text-section">Your stay,<br />at your pace.</h2>
            <p className="mt-8 max-w-[34ch] text-body text-ink/65">Tell us your dates and who is coming. We will be in touch with availability and rates for the {room.name}.</p>
          </div>
          <EnquireForm key={room.slug} roomName={room.name} />
        </div>
      </section>

      <section className="shell-px section-y" aria-labelledby="next-room-heading">
        <div className="mb-9 flex items-center justify-between gap-5">
          <h2 id="next-room-heading" className="text-label uppercase text-ink/55">Another way to stay</h2>
          <Button asChild><Link href="/rooms" className="inline-flex min-h-11 items-center gap-3 text-label uppercase hover:text-brick"><ArrowLeft aria-hidden="true" className="size-4" />All rooms</Link></Button>
        </div>
        <Link href={`/rooms/${nextRoom.slug}`} className="group relative block overflow-hidden text-white">
          <Photo src={`/images/rooms/${nextRoom.id}.webp`} alt={`${nextRoom.name} at Lingkor`} sizes="90vw" className="h-[45svh] min-h-72" imgClassName="transition-transform duration-700 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-7 md:p-12"><div><p className="text-label uppercase">Discover the {nextRoom.name}</p><p className="mt-4 font-display text-[clamp(2.5rem,5vw,5rem)] leading-none">{nextRoom.name}</p></div><ArrowRight aria-hidden="true" strokeWidth={1} className="size-9 transition-transform group-hover:translate-x-2" /></div>
        </Link>
      </section>
      <Footer background="surface" />
    </main>
  );
}
