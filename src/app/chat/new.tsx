import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Button, ErrorText, TextField } from '@/components/form';
import { Card } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { startDirectChat } from '@/lib/chat';
import { normalizeNepaliMobile } from '@/lib/phone';

export default function NewChatScreen() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    const phone = normalizeNepaliMobile(input);
    if (!phone) {
      setError('Enter a Nepali mobile number, like 98XXXXXXXX.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const id = await startDirectChat(phone);
      if (id) router.replace(`/chat/${id}`);
      else setError('Nobody on Sanjal has that number yet. Invite them!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <Card>
        <ThemedText type="smallBold">Their mobile number</ThemedText>
        <TextField
          value={input}
          onChangeText={setInput}
          placeholder="98XXXXXXXX"
          keyboardType="phone-pad"
          autoFocus
          onSubmitEditing={start}
        />
        <ErrorText>{error}</ErrorText>
        <Button label="Start chat" onPress={start} busy={busy} disabled={input.trim() === ''} />
      </Card>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.three,
  },
});
