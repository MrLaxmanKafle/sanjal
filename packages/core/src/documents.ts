/**
 * The document deadline vault.
 *
 * Design constraint that drives everything here: THE DATA NEVER LEAVES THE
 * DEVICE. Visa and passport details are exactly the information a scammer
 * targeting migrants wants most, and we have no business holding a database of
 * it in Phase 0. Storage is localStorage; reminders leave as a calendar file
 * the person downloads. When accounts arrive in Phase 1 this stays opt-in and
 * encrypted, never the default.
 */

export const DOCUMENT_TYPES = [
  { id: "passport", label: "Passport", labelNepali: "राहदानी", leadTimeDays: 180 },
  { id: "visa", label: "Visa or residence permit", labelNepali: "भिसा", leadTimeDays: 90 },
  { id: "work-permit", label: "Work permit", labelNepali: "कार्य अनुमति", leadTimeDays: 90 },
  { id: "id-card", label: "ID or residence card", labelNepali: "परिचयपत्र", leadTimeDays: 60 },
  { id: "licence", label: "Driving licence", labelNepali: "सवारी चालक अनुमतिपत्र", leadTimeDays: 60 },
  { id: "insurance", label: "Insurance", labelNepali: "बिमा", leadTimeDays: 30 },
  { id: "other", label: "Something else", labelNepali: "अन्य", leadTimeDays: 60 },
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number]["id"];

export type TrackedDocument = {
  id: string;
  label: string;
  type: DocumentType;
  /** ISO yyyy-mm-dd. */
  expiry: string;
  note?: string;
};

export type Urgency = "expired" | "critical" | "soon" | "planned";

export const URGENCY_COPY: Record<Urgency, string> = {
  expired: "Expired",
  critical: "Act now",
  soon: "Start soon",
  planned: "On track",
};

export function documentTypeMeta(type: DocumentType) {
  return DOCUMENT_TYPES.find((entry) => entry.id === type) ?? DOCUMENT_TYPES[DOCUMENT_TYPES.length - 1];
}

/** Whole days from today until the expiry date. Negative once it has passed. */
export function daysUntil(expiry: string, today = new Date()): number {
  const target = new Date(`${expiry}T00:00:00`);
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}

/**
 * Urgency is measured against the document's own lead time, not a fixed number
 * of days: a passport with four months left is genuinely urgent because
 * renewal takes that long, while a driving licence with four months left is not.
 */
export function urgencyOf(doc: TrackedDocument, today = new Date()): Urgency {
  const days = daysUntil(doc.expiry, today);
  if (days < 0) return "expired";
  const lead = documentTypeMeta(doc.type).leadTimeDays;
  if (days <= lead / 2) return "critical";
  if (days <= lead) return "soon";
  return "planned";
}

/** The date we suggest starting the renewal, derived from the lead time. */
export function startByDate(doc: TrackedDocument): Date {
  const expiry = new Date(`${doc.expiry}T00:00:00`);
  expiry.setDate(expiry.getDate() - documentTypeMeta(doc.type).leadTimeDays);
  return expiry;
}

export function formatDate(date: Date | string): string {
  const value = typeof date === "string" ? new Date(`${date}T00:00:00`) : date;
  return value.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function describeCountdown(days: number): string {
  if (days < 0) {
    const past = Math.abs(days);
    return past === 1 ? "1 day ago" : `${past} days ago`;
  }
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days < 60) return `in ${days} days`;
  const months = Math.round(days / 30);
  return `in about ${months} months`;
}

function escapeIcs(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/**
 * RFC 5545 caps a content line at 75 octets and folds the remainder onto
 * continuation lines beginning with a space. Descriptions here routinely run
 * past that, and some calendar clients reject the file rather than wrapping it
 * themselves. Folding is done on bytes, not characters, so Devanagari in a note
 * cannot be split mid-codepoint.
 */
function utf8Length(codePoint: number): number {
  if (codePoint <= 0x7f) return 1;
  if (codePoint <= 0x7ff) return 2;
  if (codePoint <= 0xffff) return 3;
  return 4;
}

function foldIcsLine(line: string): string {
  // Iterating with the spread operator walks whole code points, so a surrogate
  // pair or a Devanagari cluster is never split by the fold. No TextEncoder:
  // this package must run unchanged on React Native, where it is not guaranteed.
  const characters = [...line];
  let total = 0;
  for (const character of characters) total += utf8Length(character.codePointAt(0) ?? 0);
  if (total <= 75) return line;

  const segments: string[] = [];
  let current = "";
  let used = 0;
  // 75 octets for the first line, 74 after that (the leading space counts).
  let limit = 75;

  for (const character of characters) {
    const size = utf8Length(character.codePointAt(0) ?? 0);
    if (used + size > limit) {
      segments.push(current);
      current = "";
      used = 0;
      limit = 74;
    }
    current += character;
    used += size;
  }
  if (current) segments.push(current);

  return segments.join("\r\n ");
}

function toIcsDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * Builds a calendar file with one all-day event per document, on the date the
 * renewal should START — not the expiry date, which is far too late to be
 * useful. This is how a reminder reaches someone with no account and no
 * push notifications: their own calendar does the work.
 */
export function buildCalendar(documents: TrackedDocument[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sanjal//Document deadlines//EN",
    "CALSCALE:GREGORIAN",
  ];

  for (const doc of documents) {
    const start = startByDate(doc);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const meta = documentTypeMeta(doc.type);

    lines.push(
      "BEGIN:VEVENT",
      `UID:${doc.id}@sanjal`,
      `DTSTAMP:${toIcsDate(new Date())}T000000Z`,
      `DTSTART;VALUE=DATE:${toIcsDate(start)}`,
      `DTEND;VALUE=DATE:${toIcsDate(end)}`,
      `SUMMARY:${escapeIcs(`Start renewing: ${doc.label}`)}`,
      `DESCRIPTION:${escapeIcs(
        `${meta.label} expires on ${formatDate(doc.expiry)}. Renewal usually needs about ${meta.leadTimeDays} days, so start now.${doc.note ? ` Note: ${doc.note}` : ""}`,
      )}`,
      "BEGIN:VALARM",
      "TRIGGER:-P7D",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeIcs(`Sanjal reminder: ${doc.label}`)}`,
      "END:VALARM",
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.map(foldIcsLine).join("\r\n");
}

const URGENCY_ORDER: Record<Urgency, number> = {
  expired: 0,
  critical: 1,
  soon: 2,
  planned: 3,
};

/**
 * The order the list is read in: most urgent first, then soonest expiry. Shared
 * so that web and mobile cannot drift into presenting the same vault
 * differently — the ordering is part of the product, not a view detail.
 */
export function sortByUrgency(
  documents: readonly TrackedDocument[],
  today = new Date(),
): TrackedDocument[] {
  return [...documents].sort((a, b) => {
    const byUrgency = URGENCY_ORDER[urgencyOf(a, today)] - URGENCY_ORDER[urgencyOf(b, today)];
    return byUrgency !== 0 ? byUrgency : a.expiry.localeCompare(b.expiry);
  });
}
