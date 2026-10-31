import { NativeTabs } from 'expo-router/native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="calendar" md="calendar_today" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="news">
        <NativeTabs.Trigger.Label>News</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="newspaper" md="newspaper" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="kathmandu">
        <NativeTabs.Trigger.Label>Kathmandu</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.3" md="groups" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
