import { Card, Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';

export default function KathmanduScreen() {
  return (
    <Screen title="काठमाडौं" subtitle="Events, groups and local help in the valley.">
      <Card>
        <ThemedText type="smallBold">Coming next</ThemedText>
        <ThemedText themeColor="textSecondary">
          City groups, posts and an events calendar for Kathmandu. These need accounts and a
          database, which arrive in the next release.
        </ThemedText>
      </Card>
    </Screen>
  );
}
