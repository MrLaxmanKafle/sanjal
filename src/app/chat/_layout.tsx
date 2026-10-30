import { Stack } from 'expo-router';

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="new" options={{ title: 'New chat', presentation: 'modal' }} />
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </Stack>
  );
}
