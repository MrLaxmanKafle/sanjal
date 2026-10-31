import { useState } from 'react';

import { Button, ErrorText, TextField } from '@/components/form';
import { Card } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { formatNepaliMobile, normalizeNepaliMobile } from '@/lib/phone';
import { supabase } from '@/lib/supabase';

/** Two steps: Nepali mobile number, then the 6-digit SMS code. */
export function SignIn() {
  const [input, setInput] = useState('');
  const [phone, setPhone] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode() {
    const normalized = normalizeNepaliMobile(input);
    if (!normalized) {
      setError('Enter a Nepali mobile number, like 98XXXXXXXX.');
      return;
    }
    setBusy(true);
    setError(null);
    const { error } = await supabase!.auth.signInWithOtp({ phone: normalized });
    setBusy(false);
    if (error) setError(error.message);
    else setPhone(normalized);
  }

  async function verify() {
    if (!phone) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase!.auth.verifyOtp({ phone, token: code.trim(), type: 'sms' });
    setBusy(false);
    // On success the auth provider picks up the new session.
    if (error) setError('That code did not work. Check it, or ask for a new one.');
  }

  if (!phone) {
    return (
      <Card>
        <ThemedText type="smallBold">Sign in with your mobile number</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          One Nepali number per person keeps Sanjal real. We send a 6-digit code by SMS.
        </ThemedText>
        <TextField
          value={input}
          onChangeText={setInput}
          placeholder="98XXXXXXXX"
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          onSubmitEditing={sendCode}
        />
        <ErrorText>{error}</ErrorText>
        <Button label="Send code" onPress={sendCode} busy={busy} disabled={input.trim() === ''} />
      </Card>
    );
  }

  return (
    <Card>
      <ThemedText type="smallBold">Enter the code sent to {formatNepaliMobile(phone)}</ThemedText>
      <TextField
        value={code}
        onChangeText={setCode}
        placeholder="123456"
        keyboardType="number-pad"
        autoComplete="sms-otp"
        textContentType="oneTimeCode"
        maxLength={6}
        onSubmitEditing={verify}
      />
      <ErrorText>{error}</ErrorText>
      <Button label="Verify" onPress={verify} busy={busy} disabled={code.trim().length !== 6} />
      <Button
        label="Use a different number"
        variant="plain"
        onPress={() => {
          setPhone(null);
          setCode('');
          setError(null);
        }}
      />
    </Card>
  );
}
