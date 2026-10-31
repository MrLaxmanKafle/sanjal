import { useState } from 'react';

import { Button, ErrorText, TextField } from '@/components/form';
import { Card } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';

/** Asked once, right after the first sign-in. */
export function ProfileSetup() {
  const { session, reloadProfile, signOut } = useAuth();
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (!session) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase!.from('profiles').insert({
      id: session.user.id,
      display_name: name.trim(),
      home_district: district.trim() || null,
    });
    setBusy(false);
    if (error) setError(error.message);
    else await reloadProfile();
  }

  return (
    <Card>
      <ThemedText type="smallBold">What should people call you?</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Use your real name, the one friends and family know you by.
      </ThemedText>
      <TextField value={name} onChangeText={setName} placeholder="Your name" autoComplete="name" maxLength={50} />
      <TextField
        value={district}
        onChangeText={setDistrict}
        placeholder="Home district (optional), e.g. Kaski"
        maxLength={50}
      />
      <ErrorText>{error}</ErrorText>
      <Button label="Continue" onPress={save} busy={busy} disabled={name.trim() === ''} />
      <Button label="Sign out" variant="plain" onPress={signOut} />
    </Card>
  );
}
