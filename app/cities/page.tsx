import type { Metadata } from "next";
import Link from "next/link";
import { cities, isSeeded } from "@/lib/cities";

export const metadata: Metadata = {
  title: "City hubs",
  description:
    "Events, Nepali businesses and community organisations, city by city. We are opening the first five with the organisers already working in them.",
};

export default function CitiesIndex() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-balance sm:text-4xl">City hubs</h1>
        <p className="mt-3 text-muted">
          Every Nepali city community already exists — in group chats, in societies, in the
          restaurant everyone ends up at. A hub is just the part that should be findable: what is
          on, who runs it, and which businesses are ours.
        </p>
        <p className="mt-3 text-muted">
          These five open first. They are hand-curated rather than crowd-filled, because a directory
          full of closed restaurants and events that never happened is worse than an empty page.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {cities.map((city) => (
          <li key={city.slug}>
            <Link
              href={`/cities/${city.slug}`}
              className="flex h-full flex-col rounded-xl border border-line bg-surface p-5 transition-colors hover:border-accent"
            >
              <div className="flex items-baseline gap-2">
                <h2 className="font-display text-lg font-semibold">{city.name}</h2>
                <span className="font-display text-sm text-accent">{city.nameNepali}</span>
              </div>
              <p className="text-sm text-muted">{city.country}</p>
              <p className="mt-2 flex-1 text-sm text-muted">{city.rationale}</p>
              <p className="mt-4 text-xs font-medium tracking-wide uppercase">
                {isSeeded(city) ? (
                  <span className="text-ok">Open</span>
                ) : (
                  <span className="text-muted">Being seeded</span>
                )}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-10 rounded-xl border border-dashed border-line p-6">
        <h2 className="font-display text-lg font-semibold">Your city is not here</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          The next cities go where someone is already organising. If you run a society, a student
          association, or the group chat that everyone actually reads, that is exactly who we want
          to build the next hub with.
        </p>
        <a
          href="mailto:hello@sanjal.com?subject=City%20hub"
          className="mt-4 inline-block rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90"
        >
          Start one with us
        </a>
      </section>
    </div>
  );
}
