import { ActivityIndicator, Pressable, StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function TextField(props: TextInputProps) {
  const theme = useTheme();
  return (
    <TextInput
      placeholderTextColor={theme.textSecondary}
      {...props}
      style={[
        styles.field,
        { color: theme.text, backgroundColor: theme.background, borderColor: theme.backgroundSelected },
        props.style,
      ]}
    />
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  busy?: boolean;
  variant?: 'primary' | 'plain';
};

export function Button({ label, onPress, disabled, busy, variant = 'primary' }: ButtonProps) {
  const theme = useTheme();
  const primary = variant === 'primary';
  const inactive = disabled || busy;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        primary && { backgroundColor: theme.accent },
        (pressed || inactive) && styles.dimmed,
      ]}>
      {busy ? (
        <ActivityIndicator color={primary ? '#ffffff' : theme.text} />
      ) : (
        <ThemedText type="smallBold" style={primary ? styles.primaryLabel : { color: theme.accent }}>
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

export function ErrorText({ children }: { children: string | null }) {
  const theme = useTheme();
  if (!children) return null;
  return (
    <ThemedText type="small" style={{ color: theme.accent }}>
      {children}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  field: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + Spacing.one,
    fontSize: 17,
  },
  button: {
    minHeight: 48,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  primaryLabel: {
    color: '#ffffff',
    fontSize: 16,
  },
  dimmed: {
    opacity: 0.6,
  },
});
