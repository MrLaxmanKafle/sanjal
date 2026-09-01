import type { Metadata } from "next";
import DeadlineVault from "@/components/DeadlineVault";

export const metadata: Metadata = {
  title: "Document deadlines",
  description:
    "Track when your passport, visa and permits expire, and get the date to start renewing. Stored on your device only.",
};

export default function DeadlinesPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-balance sm:text-4xl">
          Document deadlines
        </h1>
        <p className="mt-3 text-muted">
          Add what expires and Sanjal works backwards from how long that renewal really takes, so
          the warning arrives while you can still act on it.
        </p>
        <p className="mt-3 rounded-lg bg-accent-soft px-4 py-3 text-sm">
          <strong className="font-semibold">This never leaves your device.</strong> Your documents
          are saved in this browser, not on our servers — passport and visa details are exactly what
          people targeting migrants want, and we would rather not hold them at all.
        </p>
      </header>

      <DeadlineVault />
    </div>
  );
}
