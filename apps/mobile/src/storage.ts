import { parseDocuments, type TrackedDocument, type VaultStorage } from "@sanjal/core";

/**
 * The phone's answer to the storage port in @sanjal/core.
 *
 * Compare this with apps/web/lib/vault.ts: both are about thirty lines, both
 * answer the same two questions (load, save), and everything else about how the
 * vault behaves — urgency, ordering, what a refused write means — is shared.
 * That is the shape the whole app should keep as it grows.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BEFORE SHIPPING: replace the in-memory store below with real device storage.
 *
 *   npx expo install @react-native-async-storage/async-storage
 *
 * then swap the two method bodies for AsyncStorage.getItem / setItem. It was
 * left out here rather than pinned to a guessed version, because the correct
 * version is the one `expo install` picks for this SDK.
 *
 * For a vault holding passport and visa details, prefer encrypted storage
 * (expo-secure-store) for anything beyond dates, and keep it on-device — the
 * same reasoning that keeps the web vault out of our database.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const KEY = "sanjal.documents.v1";

let memory: string | null = null;

export const deviceStorage: VaultStorage = {
  async load(): Promise<TrackedDocument[]> {
    // Replace with: return parseDocuments(await AsyncStorage.getItem(KEY));
    return parseDocuments(memory);
  },
  async save(documents: TrackedDocument[]): Promise<void> {
    // Replace with: await AsyncStorage.setItem(KEY, JSON.stringify(documents));
    memory = JSON.stringify(documents);
  },
};

export const STORAGE_KEY = KEY;
