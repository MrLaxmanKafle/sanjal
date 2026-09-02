import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
  DOCUMENT_TYPES,
  createDocument,
  documentTypeMeta,
  validateDraft,
  type DocumentType,
  type TrackedDocument,
} from "@sanjal/core";

/**
 * The add-document form.
 *
 * Note what is NOT in this file: any rule about what makes an entry valid, what
 * the error should say, or how long a renewal takes. All of that comes from
 * @sanjal/core and is the same code the website runs, so the two forms cannot
 * drift apart. This file decides only how a phone presents it.
 *
 * The date is a plain text field on purpose rather than a native picker —
 * adding one means a native module whose version must match the SDK, and
 * `expo install` chooses that, not us. Swapping in a picker later touches this
 * file only.
 */

function newId(): string {
  return `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AddDocument({ onAdd }: { onAdd: (document: TrackedDocument) => void }) {
  const [label, setLabel] = useState("");
  const [type, setType] = useState<DocumentType>("passport");
  const [expiry, setExpiry] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const draft = { label, type, expiry, note };
    const problem = validateDraft(draft);
    if (problem) {
      setError(problem.message);
      return;
    }
    setError(null);
    onAdd(createDocument(draft, newId()));
    setLabel("");
    setExpiry("");
    setNote("");
  }

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Add a document</Text>
      <Text style={styles.hint}>Stays on this phone. Nothing is sent to us.</Text>

      <Text style={styles.label}>What is it?</Text>
      <TextInput
        value={label}
        onChangeText={setLabel}
        placeholder="My passport"
        placeholderTextColor="#9aa0ac"
        style={styles.input}
      />

      <Text style={styles.label}>Type</Text>
      <View style={styles.chips}>
        {DOCUMENT_TYPES.map((option) => {
          const selected = option.id === type;
          return (
            <Pressable
              key={option.id}
              onPress={() => setType(option.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={[styles.chip, selected && styles.chipOn]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextOn]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.hint}>
        Sets how early you are warned — this normally needs about{" "}
        {documentTypeMeta(type).leadTimeDays} days.
      </Text>

      <Text style={styles.label}>Expires on</Text>
      <TextInput
        value={expiry}
        onChangeText={setExpiry}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#9aa0ac"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="numbers-and-punctuation"
        style={styles.input}
      />

      <Text style={styles.label}>Note (optional)</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Renew at the embassy in Canberra"
        placeholderTextColor="#9aa0ac"
        style={styles.input}
      />

      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}

      <Pressable onPress={submit} style={styles.button} accessibilityRole="button">
        <Text style={styles.buttonText}>Track this document</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e3e1d9",
    padding: 16,
    gap: 6,
  },
  heading: { color: "#131a26", fontSize: 18, fontWeight: "700" },
  hint: { color: "#5c6373", fontSize: 13 },
  label: { color: "#131a26", fontSize: 14, fontWeight: "600", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#e3e1d9",
    backgroundColor: "#f6f5f1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#131a26",
    fontSize: 15,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 2 },
  chip: {
    borderWidth: 1,
    borderColor: "#e3e1d9",
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipOn: { backgroundColor: "#2f4fa2", borderColor: "#2f4fa2" },
  chipText: { color: "#5c6373", fontSize: 13 },
  chipTextOn: { color: "#ffffff", fontWeight: "600" },
  error: { color: "#b3261e", fontSize: 14, marginTop: 8 },
  button: {
    backgroundColor: "#2f4fa2",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 14,
  },
  buttonText: { color: "#ffffff", fontSize: 15, fontWeight: "600" },
});
