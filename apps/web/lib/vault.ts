"use client";

import { createVault, parseDocuments, type TrackedDocument } from "@sanjal/core";

/**
 * The browser's answer to the storage port that @sanjal/core defines.
 *
 * This file is the entire web-specific half of the deadline tracker — roughly
 * thirty lines. Everything else about how a vault behaves is shared with
 * mobile. When the phone app lands it supplies its own adapter of this shape
 * and inherits the rest for free.
 *
 * localStorage is used rather than anything server-side on purpose: passport
 * and visa details are what someone targeting migrants wants most, and the
 * safest database is the one that does not exist.
 */

const STORAGE_KEY = "sanjal.documents.v1";

export const vault = createVault({
  load() {
    // Private modes and locked-down browsers throw here rather than returning
    // null. Letting it throw is correct: the vault marks itself non-persisting.
    return parseDocuments(window.localStorage.getItem(STORAGE_KEY));
  },
  save(documents: TrackedDocument[]) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  },
});

/**
 * Keeps two open tabs in step. Core has no opinion about browser events, so
 * this wiring belongs to the host — but it drives the same shared vault.
 */
export function watchOtherTabs(): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) void vault.refresh();
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}
