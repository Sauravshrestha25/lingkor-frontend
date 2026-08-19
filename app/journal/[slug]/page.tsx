import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/features/navigation/components/Footer";
import { Parallax, Rise, SplitChars } from "@/components/anim";
import { Label } from "@/components/ui";
import { POSTS, allPosts, formatDate, postBySlug } from "@/lib/journal";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return { title: "Not found — Lingkor" };
  return { title: `${post.title} — Lingkor Journal`, description: post.excerpt };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const posts = allPosts();
  const index = posts.findIndex((p) => p.slug === post.slug);
  const next = posts[(index + 1) % posts.length];

  return (
    <main className="w-full">
      <header className="w-full bg-canvas pt-40 pb-16 lg:pt-52 lg:pb-20">
        <div className="mx-auto w-full shell-max shell-px">
          <Rise>
            <Label className="opacity-60">
              {post.kicker} · {formatDate(post.date)} · {post.readingTime}
            </Label>
          </Rise>

          <SplitChars
            lines={[post.title]}
            delay={120}
            className="font-display mt-8 max-w-[20ch] text-[clamp(2.25rem,5.5vw,5rem)] leading-[0.98]"
          />
        </div>
      </header>

      <figure className="mx-auto w-full shell-max shell-px">
        <Parallax
          src={post.image}
          alt={post.title}
          sizes="100vw"
          className="aspect-[16/9] w-full"
          strength={6}
        />
      </figure>

      {/* Measure is the point on a reading page: one narrow column, nothing beside
          it to look at instead. */}
      <article className="w-full bg-canvas py-24 lg:py-32">
        <div className="mx-auto w-full max-w-[46rem] px-6">
          {post.body.map((para, i) => (
            <Rise key={i} delay={i * 50}>
              <p className="text-body mb-7">{para}</p>
            </Rise>
          ))}
        </div>
      </article>

      <section className="w-full bg-sand py-20 lg:py-28">
        <div className="mx-auto w-full shell-max shell-px">
          <Rise>
            <Label className="opacity-50">Read next</Label>
            <Link
              href={`/journal/${next.slug}`}
              className="group mt-6 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <span className="font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-none transition-transform duration-700 ease-out group-hover:translate-x-3">
                {next.title}
              </span>
              <span className="text-label shrink-0 uppercase opacity-50">
                {next.kicker}
              </span>
            </Link>
          </Rise>

          <Rise delay={160} className="mt-14">
            <Link
              href="/journal"
              className="text-label uppercase underline decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-transparent"
            >
              All journal entries
            </Link>
          </Rise>
        </div>
      </section>

      <Footer />
    </main>
  );
}
