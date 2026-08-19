import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Footer from "@/features/navigation/components/Footer";
import { Parallax, Rise } from "@/components/anim";
import { Label } from "@/components/ui";
import { allPosts, formatDate } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal — Lingkor",
  description:
    "Notes on the road from Mustang, the kora at Boudhanath, and the five elements the hotel is built from.",
};

export default function JournalPage() {
  const posts = allPosts();
  const [lead, ...rest] = posts;

  return (
    <main className="w-full">
      <PageHeader
        label="Journal"
        lines={["Notes from", "the circuit"]}
        intro="The road, the stupa, and the country the hotel is named after — written down as we go."
      />

      <section className="w-full bg-canvas pb-28 lg:pb-40">
        <div className="mx-auto w-full shell-max shell-px">
          {/* Lead post, given the width the others don't get. */}
          {lead && (
            <Rise>
              <Link href={`/journal/${lead.slug}`} className="group block">
                <Parallax
                  src={lead.image}
                  alt={lead.title}
                  sizes="100vw"
                  className="aspect-video w-full"
                  strength={6}
                />
                <div className="mt-8 grid grid-cols-1 gap-6 border-t border-ink/15 pt-8 lg:grid-cols-12">
                  <div className="lg:col-span-3">
                    <Label className="opacity-50">{lead.kicker}</Label>
                    <Label className="mt-3 block opacity-40">
                      {formatDate(lead.date)} · {lead.readingTime}
                    </Label>
                  </div>
                  <div className="lg:col-span-8 lg:col-start-5">
                    <h2 className="font-display text-section transition-transform duration-700 ease-out group-hover:translate-x-2">
                      {lead.title}
                    </h2>
                    <p className="text-body mt-6 max-w-[56ch] opacity-75">
                      {lead.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            </Rise>
          )}

          <div className="mt-24 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2">
            {rest.map((post, i) => (
              <Rise key={post.slug} delay={(i % 2) * 90}>
                <Link href={`/journal/${post.slug}`} className="group block">
                  <Parallax
                    src={post.image}
                    alt={post.title}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className=" aspect-3/2 w-full"
                    strength={8}
                  />
                  <div className="mt-6 border-t border-ink/15 pt-5">
                    <Label className="opacity-50">
                      {post.kicker} · {formatDate(post.date)}
                    </Label>
                    <h2 className="font-display mt-4 text-sub transition-transform duration-700 ease-out group-hover:translate-x-2">
                      {post.title}
                    </h2>
                    <p className="text-body mt-4 opacity-70">{post.excerpt}</p>
                  </div>
                </Link>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
