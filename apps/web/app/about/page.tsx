import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Sanjal starts with paperwork instead of a feed, what we are deliberately not building, and how the community layer arrives.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 prose-sanjal">
      <h1 className="font-display text-3xl font-semibold text-balance sm:text-4xl">
        What we are building, and what we are not
      </h1>

      <p className="mt-5 text-lg text-muted">
        Sanjal is a set of tools for Nepalis living outside Nepal, starting with the paperwork that
        follows all of us around, and growing into the city communities that already exist but are
        hard to find.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold">We tried this once as a forum</h2>
      <p className="mt-3 text-ink/90">
        The first version of Sanjal was a discussion forum. It did not work, and the reason is worth
        writing down: there was nothing on it you could not already do in a Facebook group, and the
        people were in the Facebook group. A social network is only worth opening if the people are
        already there, which means the first version of anything like this cannot be a social
        network.
      </p>
      <p className="mt-3 text-ink/90">
        So the order is reversed this time. First something useful on your own, alone, on a Tuesday
        night — a passport that is about to become a problem, a procedure nobody explained. Then,
        once there is a reason to come back, the part where you find each other.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold">What is here now</h2>
      <ul className="mt-3 flex flex-col gap-2 text-ink/90">
        <li className="flex gap-3">
          <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span>
            <strong className="font-semibold">A deadline tracker</strong> that warns you early enough
            to act, and stores everything on your own device.
          </span>
        </li>
        <li className="flex gap-3">
          <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span>
            <strong className="font-semibold">Guides</strong> to the processes that recur — passport
            renewal abroad, NOC, power of attorney, police clearance, the NRN card, and the one
            nobody wants to need.
          </span>
        </li>
        <li className="flex gap-3">
          <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span>
            <strong className="font-semibold">Five city hubs</strong>, currently empty and being
            seeded by hand with the people who already organise in them.
          </span>
        </li>
      </ul>

      <h2 className="mt-10 font-display text-xl font-semibold">What we are not building</h2>
      <p className="mt-3 text-ink/90">
        Not a messaging app — Messenger, Viber and WhatsApp already have your family, and we are not
        going to win that. Not a general feed, because a feed with nobody in it is an empty room and
        a feed with everybody in it is a moderation problem we have not earned yet. Not a money
        transfer service: moving money is licensed work in every country our users live in, and
        anyone who tells you otherwise is the reason people get scammed.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold">On trust</h2>
      <p className="mt-3 text-ink/90">
        The people this is for are targeted constantly — by fake recruiters, fake agents, fake fees.
        So: guides say plainly when they have not been verified. The tracker keeps your document
        details out of our hands entirely. Businesses are listed only once confirmed. If we ever get
        a listing or a procedure wrong, the correction is the product working, not an embarrassment.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold">Where this goes</h2>
      <p className="mt-3 text-ink/90">
        City hubs with real events and directories. Rooms and jobs, structured properly instead of
        scrolling a group. An assistant that answers in Nepali, English, or the romanized Nepali
        most of us actually type, grounded in these guides rather than guessing. Then the social
        layer, scoped to cities and groups — last, on purpose.
      </p>

      <div className="mt-10">
        <WaitlistForm />
      </div>
    </div>
  );
}
