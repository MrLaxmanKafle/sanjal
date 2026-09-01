"use client";

import type { TrackedDocument } from "@/lib/documents";

/**
 * The tracker's storage, modelled as an external store so components can read
 * it with useSyncExternalStore rather than copying it into React state inside
 * an effect.
 *
 * Two things fall out of doing it this way: the snapshot is cached against the
 * raw string, so repeated reads return a stable reference instead of looping,
 * and subscribing to the browser's `storage` event keeps two open tabs in sync
 * without any extra work.
 */

const STORAGE_KEY = "sanjal.documents.v1";

const EMPTY: TrackedDocument[] = [];

let cachedRaw: string | null = null;
let cachedValue: TrackedDocument[] = EMPTY;

/**
 * When the browser refuses storage entirely we fall back to memory, so the
 * tracker still works for the length of the session — forgetful, but not broken.
 */
let storageAvailable = true;
let memoryValue: TrackedDocument[] = EMPTY;

const listeners = new Set<() => void>();

function isTrackedDocument(value: unknown): value is TrackedDocument {
  if (typeof value !== "object" || value === null) return false;
  const doc = value as Partial<TrackedDocument>;
  return (
    typeof doc.id === "string" && typeof doc.label === "string" && typeof doc.expiry === "string"
  );
}

function parse(raw: string | null): TrackedDocument[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isTrackedDocument) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Fires only for changes made in *other* tabs, which is exactly the gap
  // our own emit() does not cover.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function getSnapshot(): TrackedDocument[] {
  if (!storageAvailable) return memoryValue;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedValue = parse(raw);
    }
    return cachedValue;
  } catch {
    // Private modes and locked-down browsers throw rather than returning null.
    storageAvailable = false;
    return memoryValue;
  }
}

/** Nothing is stored server-side, so the pre-hydration snapshot is empty. */
export function getServerSnapshot(): TrackedDocument[] {
  return EMPTY;
}

/** Returns false when the browser refused to persist, so the UI can say so. */
export function save(documents: TrackedDocument[]): boolean {
  memoryValue = documents;
  const serialised = JSON.stringify(documents);
  try {
    window.localStorage.setItem(STORAGE_KEY, serialised);
    cachedRaw = serialised;
    cachedValue = documents;
    emit();
    return true;
  } catch {
    storageAvailable = false;
    emit();
    return false;
  }
}
