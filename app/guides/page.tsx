import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Plain-language guides to the Nepali paperwork people abroad actually have to deal with: passport renewal, NOC, power of attorney, police clearance, NRN card.",
};

export default function GuidesIndex() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-balance sm:text-4xl">Guides</h1>
        <p className="mt-3 text-muted">
          What the process looks like, what you will be asked for, what usually goes wrong, and
          where the official source is. Fees, forms and appointment systems differ by mission and
          change often, so every guide sends you to the authority for those.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/guides/${guide.slug}`}
              className="flex h-full flex-col rounded-xl border border-line bg-surface p-5 transition-colors hover:border-accent"
            >
              <h2 className="font-display text-lg font-semibold text-balance">{guide.title}</h2>
              <p className="mt-1 text-sm text-accent">{guide.titleNepali}</p>
              <p className="mt-2 flex-1 text-sm text-muted">{guide.summary}</p>
              <p className="mt-4 text-xs font-medium tracking-wide text-muted uppercase">
                Start {guide.startBefore.split(".")[0].toLowerCase()}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
