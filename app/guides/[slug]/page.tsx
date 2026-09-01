import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, guides } from "@/lib/guides";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.summary,
    openGraph: { title: guide.title, description: guide.summary },
  };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const bereavement = guide.tone === "bereavement";

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 prose-sanjal">
      <Link href="/guides" className="text-sm font-medium text-accent">
        ← All guides
      </Link>

      <header className="mt-4">
        <h1 className="font-display text-3xl font-semibold text-balance sm:text-4xl">
          {guide.title}
        </h1>
        <p className="mt-2 font-display text-lg text-accent">{guide.titleNepali}</p>
        <p className="mt-4 text-lg text-muted">{guide.summary}</p>
      </header>

      {guide.review.status === "unverified" ? (
        <p className="mt-6 rounded-lg border border-warn/30 bg-warn-soft px-4 py-3 text-sm text-warn">
          <strong className="font-semibold">Not yet verified.</strong> This guide describes the
          general shape of the process and has not been checked against the official sources by a
          named reviewer. Treat it as orientation, confirm the details with the authority linked at
          the bottom, and tell us if anything here is wrong.
        </p>
      ) : (
        <p className="mt-6 rounded-lg border border-ok/30 bg-ok-soft px-4 py-3 text-sm text-ok">
          <strong className="font-semibold">Checked {guide.review.lastChecked}</strong> by{" "}
          {guide.review.checkedBy}. Fees and forms still change without notice — the official
          sources are linked at the bottom.
        </p>
      )}

      {bereavement ? (
        <p className="mt-6 text-muted">
          We are sorry. This page tries to set out the steps clearly so that no one has to work them
          out from scratch at the worst moment. If you would rather have a person help, your nearest
          Nepali society or student association will usually have someone who has done this before.
        </p>
      ) : null}

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-4">
          <h2 className="text-xs font-semibold tracking-wide text-muted uppercase">Who this is for</h2>
          <p className="mt-1.5 text-sm">{guide.audience}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <h2 className="text-xs font-semibold tracking-wide text-muted uppercase">
            {bereavement ? "How long it takes" : "When to start"}
          </h2>
          <p className="mt-1.5 text-sm">{guide.startBefore}</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">What you will need</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {guide.documents.map((item) => (
            <li key={item} className="flex gap-3 text-ink/90">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">The steps</h2>
        <ol className="mt-4 flex flex-col gap-6">
          {guide.steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span
                aria-hidden
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-sm font-semibold text-accent tabular-nums"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="font-display font-semibold">{step.title}</h3>
                <p className="mt-1 text-ink/90">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">
          {bereavement ? "Things families often miss" : "What usually goes wrong"}
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {guide.pitfalls.map((item) => (
            <li key={item} className="flex gap-3 text-ink/90">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warn" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-xl border border-line bg-surface p-5">
        <h2 className="font-display text-lg font-semibold">Official sources</h2>
        <p className="mt-1 text-sm text-muted">
          These are the authorities. Where they disagree with this page, they are right.
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {guide.sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent underline underline-offset-2"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-xl border border-dashed border-line p-5">
        <h2 className="font-display text-lg font-semibold">Have you done this recently?</h2>
        <p className="mt-1 text-sm text-muted">
          The fastest way to make this guide true is someone who went through it last month. Tell us
          what was different and we will correct it, with credit.
        </p>
        <a
          href={`mailto:hello@sanjal.com?subject=${encodeURIComponent(`Correction: ${guide.title}`)}`}
          className="mt-3 inline-block rounded-lg border border-line bg-surface px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-sunk"
        >
          Send a correction
        </a>
      </section>
    </article>
  );
}
