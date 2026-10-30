import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TextField } from '@/components/form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import {
  getConversation,
  listMessages,
  markRead,
  sendMessage,
  subscribeToMessages,
  type Message,
} from '@/lib/chat';

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const me = session?.user.id;
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getConversation(id).then((c) => setTitle(c?.title ?? ''), () => {});
    listMessages(id).then(setMessages, () => setError('Could not load messages.'));
    if (me) markRead(id, me);

    const unsubscribe = subscribeToMessages(id, (message) => {
      // Our own sends are already in the list; skip their echo.
      setMessages((current) => (current.some((m) => m.id === message.id) ? current : [message, ...current]));
      if (me) markRead(id, me);
    });
    return unsubscribe;
  }, [id, me]);

  async function send() {
    const body = draft.trim();
    if (!body) return;
    setDraft('');
    setError(null);
    try {
      const sent = await sendMessage(id, body);
      setMessages((current) => (current.some((m) => m.id === sent.id) ? current : [sent, ...current]));
    } catch {
      setDraft(body);
      setError('Not sent. Check your connection and try again.');
    }
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title }} />
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
          <FlatList
            inverted
            data={messages}
            keyExtractor={(m) => String(m.id)}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => <Bubble message={item} mine={item.sender_id === me} />}
          />
          {error ? (
            <ThemedText type="small" style={[styles.error, { color: theme.accent }]}>
              {error}
            </ThemedText>
          ) : null}
          <View style={styles.composer}>
            <TextField
              style={styles.input}
              value={draft}
              onChangeText={setDraft}
              placeholder="Message"
              multiline
              maxLength={4000}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Send"
              onPress={send}
              disabled={!draft.trim()}
              style={({ pressed }) => [
                styles.send,
                { backgroundColor: theme.accent },
                (pressed || !draft.trim()) && styles.dimmed,
              ]}>
              <ThemedText type="smallBold" style={styles.sendLabel}>
                पठाउ
              </ThemedText>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

function Bubble({ message, mine }: { message: Message; mine: boolean }) {
  const theme = useTheme();
  const time = new Date(message.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return (
    <View
      style={[
        styles.bubble,
        mine
          ? [styles.mine, { backgroundColor: theme.accent }]
          : [styles.theirs, { backgroundColor: theme.backgroundElement }],
      ]}>
      <ThemedText style={mine ? styles.mineText : undefined}>{message.body}</ThemedText>
      <ThemedText type="small" style={[styles.time, mine ? styles.mineText : { color: theme.textSecondary }]}>
        {time}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  mine: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: Spacing.one,
  },
  theirs: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: Spacing.one,
  },
  mineText: {
    color: '#ffffff',
  },
  time: {
    fontSize: 11,
    lineHeight: 14,
    alignSelf: 'flex-end',
    opacity: 0.8,
  },
  error: {
    paddingHorizontal: Spacing.three,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
    padding: Spacing.two,
  },
  input: {
    flex: 1,
    maxHeight: 120,
  },
  send: {
    height: 44,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    justifyContent: 'center',
  },
  sendLabel: {
    color: '#ffffff',
  },
  dimmed: {
    opacity: 0.5,
  },
});
