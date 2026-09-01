"use client";

import { useState } from "react";
import { site } from "@/lib/site";

type State = "idle" | "sending" | "done" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city, company }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setState("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setState("done");
      setEmail("");
      setCity("");
    } catch {
      setState("error");
      setMessage("We could not reach the server. Please check your connection and try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-xl border border-line bg-ok-soft p-5">
        <p className="font-display font-semibold text-ok">You are on the list.</p>
        <p className="mt-1 text-sm text-ink/80">
          We will write when your city hub opens, and not for anything else.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-line bg-surface p-5">
      <h2 className="font-display text-lg font-semibold">Tell us where you are</h2>
      <p className="mt-1 text-sm text-muted">
        We are opening five cities first. Say which one is yours and we will start there.
      </p>

      {/* This form sits in a narrow sidebar on the home page and in a wide
          column on /about, so the fields wrap on their own minimum widths
          rather than assuming one row will fit. */}
      <div className="mt-4 flex flex-wrap gap-3">
        <label className="min-w-52 grow basis-52">
          <span className="sr-only">Email address</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink placeholder:text-muted/70"
          />
        </label>
        <label className="min-w-36 grow basis-36">
          <span className="sr-only">Your city</span>
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Your city"
            className="w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink placeholder:text-muted/70"
          />
        </label>
        <button
          type="submit"
          disabled={state === "sending"}
          className="grow rounded-lg bg-accent px-5 py-2.5 font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-60 sm:grow-0"
        >
          {state === "sending" ? "Sending…" : "Join"}
        </button>
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        value={company}
        onChange={(event) => setCompany(event.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      {state === "error" ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          {message}{" "}
          <a href={`mailto:${site.contactEmail}`} className="underline">
            Email us
          </a>{" "}
          and we will add you by hand.
        </p>
      ) : null}
    </form>
  );
}
