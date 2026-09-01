import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";
import { cities } from "@/lib/cities";
import { guides } from "@/lib/guides";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-5">
      <section className="pt-16 pb-14 sm:pt-24">
        <p className="font-display text-sm font-medium tracking-wide text-accent">
          सञ्जाल · for Nepalis abroad
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.1] font-semibold text-balance sm:text-5xl">
          The paperwork side of living abroad, handled.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Track when your passport, visa and permits expire — early enough to do something about it.
          Follow the embassy procedures other Nepalis have already worked out. Find the people from
          home in your own city.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/deadlines"
            className="rounded-lg bg-accent px-5 py-3 font-medium text-accent-ink transition-opacity hover:opacity-90"
          >
            Track a document
          </Link>
          <Link
            href="/guides"
            className="rounded-lg border border-line bg-surface px-5 py-3 font-medium transition-colors hover:bg-surface-sunk"
          >
            Read the guides
          </Link>
        </div>
      </section>

      <section className="grid gap-4 border-t border-line py-14 sm:grid-cols-3">
        <article className="rounded-xl border border-line bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Deadlines that reach you in time</h2>
          <p className="mt-2 text-sm text-muted">
            A passport with five months left already blocks most visa renewals. Sanjal counts back
            from how long each renewal actually takes and tells you the date to start — then hands
            the reminders to your own calendar.
          </p>
          <Link href="/deadlines" className="mt-3 inline-block text-sm font-medium text-accent">
            Open the tracker →
          </Link>
        </article>

        <article className="rounded-xl border border-line bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Procedures, written down once</h2>
          <p className="mt-2 text-sm text-muted">
            Passport renewal, NOC, power of attorney, police clearance. What you will be asked for,
            in what order, and where the official source is — instead of a five-year-old forum
            thread.
          </p>
          <Link href="/guides" className="mt-3 inline-block text-sm font-medium text-accent">
            {guides.length} guides →
          </Link>
        </article>

        <article className="rounded-xl border border-line bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Your city, not a global feed</h2>
          <p className="mt-2 text-sm text-muted">
            Events, Nepali businesses and the societies that run things where you actually live. We
            are opening {cities.length} cities first, curated with the people already organising in
            them.
          </p>
          <Link href="/cities" className="mt-3 inline-block text-sm font-medium text-accent">
            See the first cities →
          </Link>
        </article>
      </section>

      <section className="border-t border-line py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              We are building this in the open, slowly, and in the right order.
            </h2>
            <p className="mt-3 max-w-xl text-muted">
              The last attempt at a Nepali diaspora network was a forum, and it failed for a reason
              worth stating plainly: there was nothing you could do there that you could not already
              do in a Facebook group. So this time the useful thing comes first and the community
              layer comes second — city by city, with real organisers, once there is something
              worth gathering around.
            </p>
            <Link href="/about" className="mt-4 inline-block font-medium text-accent">
              What we are building, and what we are not →
            </Link>
          </div>
          <WaitlistForm />
        </div>
      </section>
    </div>
  );
}
