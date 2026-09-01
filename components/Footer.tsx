import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="mx-auto max-w-5xl px-5 py-10 text-sm text-muted">
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <div className="min-w-56 flex-1">
            <p className="font-display text-base font-semibold text-ink">
              {site.nameNepali} {site.name}
            </p>
            <p className="mt-1 max-w-xs">{site.tagline}</p>
          </div>
          <nav className="flex flex-col gap-2">
            <Link href="/deadlines" className="hover:text-ink">
              Deadline tracker
            </Link>
            <Link href="/guides" className="hover:text-ink">
              Guides
            </Link>
            <Link href="/cities" className="hover:text-ink">
              City hubs
            </Link>
          </nav>
          <nav className="flex flex-col gap-2">
            <Link href="/about" className="hover:text-ink">
              About Sanjal
            </Link>
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <a href={`mailto:${site.contactEmail}`} className="hover:text-ink">
              {site.contactEmail}
            </a>
          </nav>
        </div>
        <p className="mt-8 border-t border-line pt-6 text-xs leading-relaxed">
          Sanjal publishes general information, not legal or immigration advice. Rules, fees and
          forms change, and they differ by mission and by country. Always confirm your own case
          against the official source linked on each guide.
        </p>
      </div>
    </footer>
  );
}
