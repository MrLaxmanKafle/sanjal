import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold">This page isn&rsquo;t here</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">
        It may have moved, or it may be one of the parts we haven&rsquo;t built yet.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-accent px-5 py-2.5 font-medium text-accent-ink transition-opacity hover:opacity-90"
        >
          Go home
        </Link>
        <Link
          href="/guides"
          className="rounded-lg border border-line bg-surface px-5 py-2.5 font-medium transition-colors hover:bg-surface-sunk"
        >
          Browse the guides
        </Link>
      </div>
    </div>
  );
}
