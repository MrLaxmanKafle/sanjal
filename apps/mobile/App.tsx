import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  createVault,
  describeCountdown,
  daysUntil,
  documentTypeMeta,
  formatDate,
  site,
  sortByUrgency,
  startByDate,
  urgencyOf,
  URGENCY_COPY,
  type TrackedDocument,
  type Urgency,
  type VaultState,
} from "@sanjal/core";
import { deviceStorage } from "./src/storage";

/**
 * The mobile client.
 *
 * Every rule about what a deadline means — when it becomes urgent, how the list
 * is ordered, how a countdown reads — comes from @sanjal/core and is the same
 * code the website runs. This file only decides how it looks on a phone. That
 * is the whole point of the split: the two clients cannot disagree about the
 * product, only about presentation.
 */

const vault = createVault(deviceStorage);

const SERVER_STATE: VaultState = { documents: [], persisting: true, hydrated: false };
const getServerState = () => SERVER_STATE;

const URGENCY_COLOUR: Record<Urgency, string> = {
  expired: "#b3261e",
  critical: "#b3261e",
  soon: "#8a5a12",
  planned: "#2a6e4c",
};

// A stand-in until the add-document form is built, so the list has something to
// render while the shared logic is being checked on a device.
const SAMPLE: TrackedDocument[] = [
  { id: "sample-passport", label: "My passport", type: "passport", expiry: "2026-12-30" },
  { id: "sample-visa", label: "Student visa", type: "visa", expiry: "2027-10-06" },
];

export default function App() {
  const state = useSyncExternalStore(vault.subscribe, vault.getState, getServerState);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    void vault.hydrate();
  }, []);

  useEffect(() => {
    if (state.hydrated && state.documents.length === 0 && !seeded) {
      setSeeded(true);
      void vault.replaceAll(SAMPLE);
    }
  }, [state.hydrated, state.documents.length, seeded]);

  const documents = useMemo(() => sortByUrgency(state.documents), [state.documents]);

  return (
    <View style={styles.screen}>
      <StatusBar style="auto" />
      <Text style={styles.wordmark}>{site.nameNepali}</Text>
      <Text style={styles.title}>Document deadlines</Text>
      <Text style={styles.subtitle}>
        Stored on this device. The same rules the website uses.
      </Text>

      <FlatList
        style={styles.list}
        data={documents}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          const urgency = urgencyOf(item);
          const meta = documentTypeMeta(item.type);
          return (
            <View style={styles.card}>
              <View style={[styles.stripe, { backgroundColor: URGENCY_COLOUR[urgency] }]} />
              <View style={styles.cardBody}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.label}</Text>
                  <Text style={[styles.chip, { color: URGENCY_COLOUR[urgency] }]}>
                    {URGENCY_COPY[urgency]}
                  </Text>
                </View>
                <Text style={styles.meta}>
                  {meta.label} · expires {formatDate(item.expiry)} (
                  {describeCountdown(daysUntil(item.expiry))})
                </Text>
                {urgency !== "expired" ? (
                  <Text style={styles.meta}>
                    Start renewing by {formatDate(startByDate(item))}
                  </Text>
                ) : null}
                <Pressable onPress={() => void vault.remove(item.id)} hitSlop={8}>
                  <Text style={styles.remove}>Remove</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          state.hydrated ? <Text style={styles.meta}>Nothing tracked yet.</Text> : null
        }
      />

      {!state.persisting ? (
        <Text style={styles.warning}>
          This device is not saving changes. Your list will not survive a restart.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f6f5f1", paddingTop: 72, paddingHorizontal: 20 },
  wordmark: { color: "#2f4fa2", fontSize: 15, fontWeight: "600", marginBottom: 6 },
  title: { color: "#131a26", fontSize: 28, fontWeight: "700" },
  subtitle: { color: "#5c6373", fontSize: 15, marginTop: 6, marginBottom: 20 },
  list: { flex: 1 },
  separator: { height: 12 },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e3e1d9",
    overflow: "hidden",
  },
  stripe: { width: 5 },
  cardBody: { flex: 1, padding: 14, gap: 4 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  cardTitle: { color: "#131a26", fontSize: 16, fontWeight: "600" },
  chip: { fontSize: 12, fontWeight: "600" },
  meta: { color: "#5c6373", fontSize: 14 },
  remove: { color: "#5c6373", fontSize: 14, marginTop: 6 },
  warning: { color: "#8a5a12", fontSize: 13, paddingVertical: 12 },
});
