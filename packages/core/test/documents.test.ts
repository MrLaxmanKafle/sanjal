import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildCalendar,
  daysUntil,
  describeCountdown,
  sortByUrgency,
  startByDate,
  urgencyOf,
  type TrackedDocument,
} from "../src/documents.ts";
import { createVault, parseDocuments } from "../src/vault.ts";

const TODAY = new Date("2026-01-01T00:00:00");

function doc(over: Partial<TrackedDocument> = {}): TrackedDocument {
  return { id: "a", label: "My passport", type: "passport", expiry: "2026-12-31", ...over };
}

test("urgency is relative to each document's own lead time", () => {
  // 120 days out: urgent for a passport (180-day lead), fine for a licence (60).
  const in120 = "2026-05-01";
  assert.equal(urgencyOf(doc({ type: "passport", expiry: in120 }), TODAY), "soon");
  assert.equal(urgencyOf(doc({ type: "licence", expiry: in120 }), TODAY), "planned");
});

test("a passport inside half its lead time is critical, and past expiry is expired", () => {
  assert.equal(urgencyOf(doc({ expiry: "2026-03-01" }), TODAY), "critical");
  assert.equal(urgencyOf(doc({ expiry: "2025-12-01" }), TODAY), "expired");
});

test("the start-by date is the expiry minus the lead time", () => {
  assert.equal(startByDate(doc({ expiry: "2026-12-31" })).toISOString().slice(0, 10), "2026-07-04");
});

test("sorting puts the most urgent first, then the soonest expiry", () => {
  const ordered = sortByUrgency(
    [
      doc({ id: "fine", type: "licence", expiry: "2027-06-01" }),
      doc({ id: "gone", expiry: "2025-06-01" }),
      doc({ id: "soon", expiry: "2026-05-01" }),
    ],
    TODAY,
  );
  assert.deepEqual(ordered.map((d) => d.id), ["gone", "soon", "fine"]);
});

test("countdown reads naturally on both sides of today", () => {
  assert.equal(describeCountdown(0), "today");
  assert.equal(describeCountdown(1), "tomorrow");
  assert.equal(describeCountdown(-1), "1 day ago");
  assert.equal(describeCountdown(120), "in about 4 months");
});

test("daysUntil is not thrown off by the time of day", () => {
  assert.equal(daysUntil("2026-01-02", new Date("2026-01-01T23:59:00")), 1);
});

test("the calendar folds long lines to 75 octets without splitting a character", () => {
  const ics = buildCalendar([doc({ note: "नवीकरण काठमाडौंको दूतावासमा गर्नुपर्छ" })]);
  for (const line of ics.split("\r\n")) {
    assert.ok(Buffer.byteLength(line, "utf8") <= 75, `line too long: ${line}`);
  }
  // A fold must never leave a replacement character behind.
  assert.ok(!ics.includes("�"));
  assert.ok(ics.startsWith("BEGIN:VCALENDAR"));
  assert.ok(ics.includes("BEGIN:VALARM"));
});

test("the reminder lands on the start-by date, not the expiry date", () => {
  const ics = buildCalendar([doc({ expiry: "2026-12-31" })]);
  assert.ok(ics.includes("DTSTART;VALUE=DATE:20260704"));
});

test("malformed stored data yields an empty vault rather than throwing", () => {
  assert.deepEqual(parseDocuments("not json"), []);
  assert.deepEqual(parseDocuments('{"not":"an array"}'), []);
  assert.deepEqual(parseDocuments('[{"id":"x"}]'), []); // missing required fields
  assert.equal(parseDocuments(JSON.stringify([doc()])).length, 1);
});

test("a vault whose storage refuses writes keeps the change but reports the failure", async () => {
  const vault = createVault({
    load: () => [],
    save: () => {
      throw new Error("quota exceeded");
    },
  });
  await vault.hydrate();
  await vault.add(doc());

  const state = vault.getState();
  assert.equal(state.documents.length, 1, "the change must survive on screen");
  assert.equal(state.persisting, false, "and the UI must be told it was not saved");
});

test("subscribers are notified on change and stop after unsubscribing", async () => {
  const vault = createVault({ load: () => [], save: () => {} });
  let calls = 0;
  const unsubscribe = vault.subscribe(() => {
    calls += 1;
  });
  await vault.add(doc());
  assert.equal(calls, 1);
  unsubscribe();
  await vault.add(doc({ id: "b" }));
  assert.equal(calls, 1);
});
