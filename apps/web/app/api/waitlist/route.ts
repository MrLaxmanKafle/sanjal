import { NextResponse } from "next/server";

/**
 * Waitlist intake.
 *
 * There is no database in Phase 0 on purpose. Signups are forwarded to whatever
 * endpoint WAITLIST_WEBHOOK_URL points at (a spreadsheet, an email service, a
 * CRM) so the first thousand people can be collected without standing up
 * infrastructure that would then have to be secured and backed up.
 *
 * If the webhook is not configured the route says so plainly and the form falls
 * back to email. It never pretends to have stored an address it dropped —
 * silently losing signups is the failure that would matter most here.
 */

const MAX_PER_WINDOW = 5;
const WINDOW_MS = 60_000;

/** Best-effort throttle. Resets on redeploy, which is acceptable at this stage. */
const recentRequests = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (recentRequests.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  hits.push(now);
  recentRequests.set(key, hits);
  return hits.length > MAX_PER_WINDOW;
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export async function POST(request: Request) {
  const webhook = process.env.WAITLIST_WEBHOOK_URL;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Could not read that request." }, { status: 400 });
  }

  const body = payload as { email?: unknown; city?: unknown; company?: unknown };

  // Honeypot: a real person never fills a field they cannot see.
  if (typeof body.company === "string" && body.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim().slice(0, 80) : "";

  if (!looksLikeEmail(email) || email.length > 254) {
    return NextResponse.json({ error: "That email address does not look right." }, { status: 400 });
  }

  if (!webhook) {
    return NextResponse.json(
      {
        error:
          "The waitlist is not connected yet. Please email us instead and we will add you by hand.",
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, city, source: "sanjal-web", at: new Date().toISOString() }),
    });

    if (!response.ok) {
      throw new Error(`Webhook responded ${response.status}`);
    }
  } catch (error) {
    console.error("Waitlist forwarding failed", error);
    return NextResponse.json(
      { error: "We could not save that just now. Please try again, or email us." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
