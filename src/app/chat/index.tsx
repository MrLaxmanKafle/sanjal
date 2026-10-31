import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/form';
import { ProfileSetup } from '@/components/profile-setup';
import { Card, Screen } from '@/components/screen';
import { SignIn } from '@/components/sign-in';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAsync } from '@/hooks/use-async';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { listConversations, type ConversationSummary } from '@/lib/chat';

export default function ChatTab() {
  const auth = useAuth();

  if (!auth.configured) {
    return (
      <Screen title="कुराकानी">
        <Card>
          <ThemedText type="smallBold">Chat is not switched on yet</ThemedText>
          <ThemedText themeColor="textSecondary">
            This build has no Sanjal server configured. See .env.example in the project.
          </ThemedText>
        </Card>
      </Screen>
    );
  }
  if (auth.loading) {
    return (
      <Screen title="कुराकानी">
        <ActivityIndicator />
      </Screen>
    );
  }
  if (!auth.session) {
    return (
      <Screen title="कुराकानी" subtitle="Chat with friends and family on Sanjal.">
        <SignIn />
      </Screen>
    );
  }
  if (!auth.profile) {
    return (
      <Screen title="कुराकानी">
        <ProfileSetup />
      </Screen>
    );
  }
  return <Inbox />;
}

function Inbox() {
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const inbox = useAsync(listConversations);
  const { reload } = inbox;

  // Coming back from a chat should show its latest message.
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return (
    <Screen
      title="कुराकानी"
      subtitle={`Signed in as ${profile?.display_name}`}
      refreshing={inbox.loading}
      onRefresh={inbox.reload}>
      <Button label="New chat" onPress={() => router.push('/chat/new')} />
      {inbox.error && !inbox.data ? (
        <ThemedText themeColor="textSecondary">Could not load your chats. Pull down to try again.</ThemedText>
      ) : null}
      {inbox.data?.length === 0 ? (
        <ThemedText themeColor="textSecondary">
          No chats yet. Start one with someone&apos;s mobile number.
        </ThemedText>
      ) : null}
      {inbox.data?.map((c) => (
        <ConversationRow key={c.id} conversation={c} onPress={() => router.push(`/chat/${c.id}`)} />
      ))}
      <Button label="Sign out" variant="plain" onPress={signOut} />
    </Screen>
  );
}

function ConversationRow({ conversation, onPress }: { conversation: ConversationSummary; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <Card>
        <View style={styles.rowTop}>
          <ThemedText type="smallBold" style={styles.title} numberOfLines={1}>
            {conversation.title}
          </ThemedText>
          {conversation.unread ? <View style={[styles.dot, { backgroundColor: theme.accent }]} /> : null}
        </View>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {conversation.last_message ?? 'Say namaste 👋'}
        </ThemedText>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
