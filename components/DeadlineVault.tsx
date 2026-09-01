"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getSnapshot,
  save,
  subscribe,
} from "@/lib/documentStore";
import {
  DOCUMENT_TYPES,
  type DocumentType,
  type TrackedDocument,
  type Urgency,
  URGENCY_COPY,
  buildCalendar,
  daysUntil,
  describeCountdown,
  documentTypeMeta,
  formatDate,
  startByDate,
  urgencyOf,
} from "@/lib/documents";

const URGENCY_STYLES: Record<Urgency, { stripe: string; chip: string }> = {
  expired: { stripe: "bg-danger", chip: "bg-danger-soft text-danger" },
  critical: { stripe: "bg-danger", chip: "bg-danger-soft text-danger" },
  soon: { stripe: "bg-warn", chip: "bg-warn-soft text-warn" },
  planned: { stripe: "bg-ok", chip: "bg-ok-soft text-ok" },
};

const URGENCY_ORDER: Record<Urgency, number> = {
  expired: 0,
  critical: 1,
  soon: 2,
  planned: 3,
};

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function DeadlineVault() {
  const documents = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [storageBlocked, setStorageBlocked] = useState(false);
  const [label, setLabel] = useState("");
  const [type, setType] = useState<DocumentType>("passport");
  const [expiry, setExpiry] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const persist = useCallback((next: TrackedDocument[]) => {
    setStorageBlocked(!save(next));
  }, []);

  const sorted = useMemo(() => {
    return [...documents].sort((a, b) => {
      const byUrgency = URGENCY_ORDER[urgencyOf(a)] - URGENCY_ORDER[urgencyOf(b)];
      return byUrgency !== 0 ? byUrgency : a.expiry.localeCompare(b.expiry);
    });
  }, [documents]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = label.trim();
    if (!trimmed) {
      setError("Give the document a name you will recognise, like “My passport”.");
      return;
    }
    if (!expiry) {
      setError("Add the expiry date printed on the document.");
      return;
    }
    setError(null);
    persist([
      ...documents,
      { id: newId(), label: trimmed, type, expiry, note: note.trim() || undefined },
    ]);
    setLabel("");
    setNote("");
    setExpiry("");
  }

  function handleRemove(id: string) {
    persist(documents.filter((doc) => doc.id !== id));
  }

  function handleDownloadCalendar() {
    const file = new Blob([buildCalendar(sorted)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "sanjal-deadlines.ics";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[20rem_1fr] lg:items-start">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-line bg-surface p-5 lg:sticky lg:top-20"
      >
        <h2 className="font-display text-lg font-semibold">Add a document</h2>
        <p className="mt-1 text-sm text-muted">
          Stays on this device. Nothing is sent to us.
        </p>

        <div className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">What is it?</span>
            <input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="My passport"
              className="rounded-lg border border-line bg-paper px-3 py-2 text-ink placeholder:text-muted/70"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Type</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as DocumentType)}
              className="rounded-lg border border-line bg-paper px-3 py-2 text-ink"
            >
              {DOCUMENT_TYPES.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="text-xs text-muted">
              Sets how early we warn you — renewal for this normally needs about{" "}
              {documentTypeMeta(type).leadTimeDays} days.
            </span>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Expires on</span>
            <input
              type="date"
              value={expiry}
              onChange={(event) => setExpiry(event.target.value)}
              className="rounded-lg border border-line bg-paper px-3 py-2 text-ink"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">
              Note <span className="font-normal text-muted">(optional)</span>
            </span>
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Renew at the embassy in Canberra"
              className="rounded-lg border border-line bg-paper px-3 py-2 text-ink placeholder:text-muted/70"
            />
          </label>

          {error ? (
            <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2.5 font-medium text-accent-ink transition-opacity hover:opacity-90"
          >
            Track this document
          </button>
        </div>
      </form>

      <div>
        {storageBlocked ? (
          <p className="mb-4 rounded-lg bg-warn-soft px-4 py-3 text-sm text-warn">
            Your browser is blocking local storage, so this list will disappear when you close the
            tab. Download the calendar file below to keep your reminders.
          </p>
        ) : null}

        {sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-surface p-8 text-center">
            <p className="font-display text-lg font-semibold">Nothing tracked yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Start with your passport. Most people discover the problem the week a visa renewal is
              refused for having under six months of validity left — the point of this page is to
              tell you six months earlier.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold">
                {sorted.length} document{sorted.length === 1 ? "" : "s"}
              </h2>
              <button
                type="button"
                onClick={handleDownloadCalendar}
                className="rounded-lg border border-line bg-surface px-3.5 py-2 text-sm font-medium transition-colors hover:bg-surface-sunk"
              >
                Add reminders to my calendar
              </button>
            </div>

            <ul className="flex flex-col gap-3">
              {sorted.map((doc) => {
                const urgency = urgencyOf(doc);
                const styles = URGENCY_STYLES[urgency];
                const days = daysUntil(doc.expiry);
                const meta = documentTypeMeta(doc.type);
                return (
                  <li
                    key={doc.id}
                    className="relative overflow-hidden rounded-xl border border-line bg-surface pl-4"
                  >
                    <span className={`absolute inset-y-0 left-0 w-1.5 ${styles.stripe}`} aria-hidden />
                    <div className="flex flex-wrap items-start gap-x-4 gap-y-2 p-4">
                      <div className="min-w-48 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display font-semibold">{doc.label}</h3>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles.chip}`}
                          >
                            {URGENCY_COPY[urgency]}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted">
                          {meta.label} · expires {formatDate(doc.expiry)}{" "}
                          <span className="tabular-nums">({describeCountdown(days)})</span>
                        </p>
                        {urgency !== "expired" ? (
                          <p className="mt-1 text-sm text-muted">
                            Start renewing by{" "}
                            <span className="font-medium text-ink">
                              {formatDate(startByDate(doc))}
                            </span>
                          </p>
                        ) : (
                          <p className="mt-1 text-sm text-danger">
                            Renew as soon as you can, and check whether anything else depends on it.
                          </p>
                        )}
                        {doc.note ? <p className="mt-1 text-sm text-muted">{doc.note}</p> : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(doc.id)}
                        className="rounded-md px-2 py-1 text-sm text-muted transition-colors hover:bg-surface-sunk hover:text-danger"
                        aria-label={`Remove ${doc.label}`}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
