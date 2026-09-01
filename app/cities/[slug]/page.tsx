import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cities, getCity } from "@/lib/cities";
import { formatDate } from "@/lib/documents";

export function generateStaticParams() {
  return cities.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cities/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) return {};
  return {
    title: `Nepali community in ${city.name}`,
    description: `Events, businesses and organisations for the Nepali community in ${city.name}, ${city.country}.`,
  };
}

export default async function CityPage({ params }: PageProps<"/cities/[slug]">) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link href="/cities" className="text-sm font-medium text-accent">
        ← All cities
      </Link>

      <header className="mt-4">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{city.name}</h1>
          <span className="font-display text-xl text-accent">{city.nameNepali}</span>
        </div>
        <p className="mt-1 text-muted">{city.country}</p>
        <p className="mt-4 text-muted">{city.rationale}</p>
      </header>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">What&rsquo;s on</h2>
        {city.events.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-line bg-surface p-5 text-sm text-muted">
            Nothing listed yet. We add events only once we have them from the organiser, so that a
            date here can be trusted — festival dates in particular move every year with the lunar
            calendar.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {city.events.map((event) => (
              <li key={event.id} className="rounded-xl border border-line bg-surface p-4">
                <h3 className="font-display font-semibold">{event.title}</h3>
                <p className="mt-1 text-sm text-muted">
                  {formatDate(event.date)}
                  {event.venue ? ` · ${event.venue}` : ""} · {event.organiser}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">Nepali businesses</h2>
        {city.listings.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-line bg-surface p-5 text-sm text-muted">
            No listings yet. Restaurants, groceries, remittance agents, accountants and lawyers go
            here — each one confirmed as trading before it appears.
          </p>
        ) : (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {city.listings.map((listing) => (
              <li key={listing.id} className="rounded-xl border border-line bg-surface p-4">
                <h3 className="font-display font-semibold">{listing.name}</h3>
                <p className="mt-1 text-sm text-muted">
                  {listing.category}
                  {listing.neighbourhood ? ` · ${listing.neighbourhood}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">Societies and organisations</h2>
        {city.organisations.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-line bg-surface p-5 text-sm text-muted">
            Not listed yet. Societies, NRNA chapters and student associations appear here once
            they&rsquo;ve confirmed their own details — we don&rsquo;t list a group without asking it
            first.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {city.organisations.map((org) => (
              <li key={org.name} className="rounded-lg border border-line bg-surface px-4 py-3">
                <span className="font-medium">{org.name}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12 rounded-xl border border-accent/30 bg-accent-soft p-6">
        <h2 className="font-display text-lg font-semibold">Help open {city.name}</h2>
        <p className="mt-1 text-sm">
          We are looking for one person in {city.name} who already knows the societies and the
          businesses. That is the whole job: tell us what is real, and this hub opens.
        </p>
        <a
          href={`mailto:hello@sanjal.com?subject=${encodeURIComponent(`${city.name} hub`)}`}
          className="mt-4 inline-block rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90"
        >
          I can help with {city.name}
        </a>
      </section>
    </div>
  );
}
