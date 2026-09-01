import type { TrackedDocument } from "./documents";

/**
 * The document vault, with storage left as a hole for the host platform to fill.
 *
 * This is the piece that makes one engine serve both web and mobile. The rules
 * about what a vault *is* — that it holds documents, that adding one persists
 * it, that subscribers are told when it changes, that a refused write must be
 * visible rather than silent — live here and are written once. The question of
 * *where* bytes land is answered by the host: localStorage on web, encrypted
 * storage on a phone. Neither answer belongs in shared code.
 *
 * `load` and `save` may be synchronous or async. Web storage is synchronous and
 * mobile storage is not, so the contract accepts both and the vault keeps an
 * in-memory snapshot that reads never block on.
 */

export type VaultStorage = {
  load(): TrackedDocument[] | Promise<TrackedDocument[]>;
  save(documents: TrackedDocument[]): void | Promise<void>;
};

export type VaultState = {
  documents: TrackedDocument[];
  /** False once a write has been refused — the UI must say so, not pretend. */
  persisting: boolean;
  /** True once the first load has settled, so hosts can hold off empty states. */
  hydrated: boolean;
};

export type Vault = {
  subscribe(listener: () => void): () => void;
  getState(): VaultState;
  hydrate(): Promise<void>;
  add(document: TrackedDocument): Promise<void>;
  remove(id: string): Promise<void>;
  replaceAll(documents: TrackedDocument[]): Promise<void>;
  /** Notify subscribers of a change made elsewhere, e.g. another browser tab. */
  refresh(): Promise<void>;
};

const EMPTY: TrackedDocument[] = [];

export function isTrackedDocument(value: unknown): value is TrackedDocument {
  if (typeof value !== "object" || value === null) return false;
  const doc = value as Partial<TrackedDocument>;
  return (
    typeof doc.id === "string" && typeof doc.label === "string" && typeof doc.expiry === "string"
  );
}

/** Shared by every storage adapter, so one malformed record cannot empty a vault. */
export function parseDocuments(raw: string | null | undefined): TrackedDocument[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isTrackedDocument) : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function createVault(storage: VaultStorage): Vault {
  let state: VaultState = { documents: EMPTY, persisting: true, hydrated: false };
  const listeners = new Set<() => void>();

  function emit() {
    for (const listener of listeners) listener();
  }

  /**
   * The snapshot object is replaced only when something actually changed, so
   * subscribers comparing by reference (React's useSyncExternalStore among
   * them) do not re-render on every read.
   */
  function setState(next: Partial<VaultState>) {
    state = { ...state, ...next };
    emit();
  }

  async function commit(documents: TrackedDocument[]) {
    // The in-memory copy updates first: the change must survive on screen even
    // when the device refuses to persist it.
    let persisted = true;
    try {
      await storage.save(documents);
    } catch {
      persisted = false;
    }
    setState({ documents, persisting: persisted });
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState() {
      return state;
    },

    async hydrate() {
      try {
        const documents = await storage.load();
        setState({ documents, hydrated: true });
      } catch {
        setState({ documents: EMPTY, hydrated: true, persisting: false });
      }
    },

    async add(document) {
      await commit([...state.documents, document]);
    },

    async remove(id) {
      await commit(state.documents.filter((doc) => doc.id !== id));
    },

    async replaceAll(documents) {
      await commit(documents);
    },

    async refresh() {
      try {
        const documents = await storage.load();
        setState({ documents });
      } catch {
        setState({ persisting: false });
      }
    },
  };
}
