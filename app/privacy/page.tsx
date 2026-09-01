import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Sanjal stores, what it does not, and where your document details actually live.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 prose-sanjal">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Privacy</h1>
      <p className="mt-4 text-lg text-muted">
        Written in plain language, because a policy nobody can read is not consent.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold">Your documents stay on your device</h2>
      <p className="mt-3 text-ink/90">
        Everything you enter in the deadline tracker — document names, types, expiry dates, notes —
        is saved in your own browser&rsquo;s local storage. It is not sent to us, we cannot read it,
        and it is not in any backup of ours. Clearing your browser data deletes it, and we have no
        copy to restore. That trade is deliberate: passport and visa details are precisely what
        someone targeting migrants would want to steal, and the safest database is the one that does
        not exist.
      </p>
      <p className="mt-3 text-ink/90">
        The calendar file you download is generated in your browser too, and goes straight to your
        own calendar.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold">If you join the waitlist</h2>
      <p className="mt-3 text-ink/90">
        We keep the email address you give us, the city if you enter one, and the date. We use it to
        write to you when your city opens. We do not sell it, and we do not send anything else.
        Write to {site.contactEmail} and we will delete it.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold">Analytics</h2>
      <p className="mt-3 text-ink/90">
        This site currently runs no analytics and sets no advertising cookies. If we add measurement
        later it will be a privacy-preserving, aggregate tool, and this page will say so before it
        goes live.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold">Fonts and third parties</h2>
      <p className="mt-3 text-ink/90">
        Typefaces are served from our own domain rather than a font provider, so loading a page does
        not announce your visit to a third party.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold">Questions</h2>
      <p className="mt-3 text-ink/90">
        Write to {site.contactEmail}. If you are in the UK or EU and want a formal answer about your
        data rights, say so and you will get one.
      </p>
    </div>
  );
}
