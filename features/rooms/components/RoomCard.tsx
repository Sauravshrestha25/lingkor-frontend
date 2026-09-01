import { Astroid } from "lucide-react";
import { Photo } from "@/components/media/Photo";
import { Label } from "@/components/ui";

type Room = {
  id: string;
  name: string;
  note: string;
  size: string;
};

export function RoomCard({
  room,
  sizes,
  loading,
  className = "",
  headingLevel = "h3",
}: {
  room: Room;
  sizes: string;
  loading?: "eager" | "lazy";
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;

  return (
    <article className={`group ${className}`}>
      {/* Same frame the spaces cards carry, so a room and a space read as two
          views of one house rather than two components. */}
      <div className="relative outline-1 outline-solid outline-amber-300 outline-offset-[10px]">
        <Astroid
          aria-hidden="true"
          className="absolute left-1/2 top-[-20px] z-10 size-5 -translate-x-1/2 fill-current text-amber-300"
          stroke="none"
        />
        <Photo
          src={`/images/rooms/${room.id}.webp`}
          alt={`${room.name} — ${room.note}`}
          sizes={sizes}
          loading={loading}
          className="aspect-4/5"
          imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
        />
      </div>

      <div className="mt-6 flex items-baseline justify-between border-t border-ink/15 pt-5">
        <div>
          <Heading className="font-display text-sub">{room.name}</Heading>
          <Label className="mt-6 block font-sub opacity-80">{room.note}</Label>
        </div>
        <Label className="shrink-0">{room.size}</Label>
      </div>
    </article>
  );
}
