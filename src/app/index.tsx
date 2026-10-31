import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAsync } from '@/hooks/use-async';
import { fetchRates, FEATURED, type Rate } from '@/lib/forex';
import { describeDay } from '@/lib/nepali-date';

export default function TodayScreen() {
  const today = useMemo(() => describeDay(new Date()), []);
  const forex = useAsync(fetchRates);
  const featured = forex.data?.rates.filter((r) => FEATURED.includes(r.iso3)) ?? [];

  return (
    <Screen title="आज" refreshing={forex.loading} onRefresh={forex.reload}>
      <Card>
        <ThemedText type="subtitle" style={styles.bsDate}>
          {today.bsNepali}
        </ThemedText>
        <ThemedText themeColor="textSecondary">
          {today.bsEnglish} · {today.ad}
        </ThemedText>
      </Card>

      <Card>
        <ThemedText type="smallBold">Exchange rates (NPR)</ThemedText>
        {forex.error && !forex.data ? (
          <ThemedText type="small" themeColor="textSecondary">
            Could not load rates. Pull down to try again.
          </ThemedText>
        ) : null}
        {featured.length > 0 ? (
          <>
            <View style={styles.row}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.currency}>
                Currency
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.number}>
                Buy
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.number}>
                Sell
              </ThemedText>
            </View>
            {featured.map((rate) => (
              <RateRow key={rate.iso3} rate={rate} />
            ))}
            <ThemedText type="small" themeColor="textSecondary">
              Nepal Rastra Bank reference rates for {forex.data?.date}
            </ThemedText>
          </>
        ) : null}
      </Card>
    </Screen>
  );
}

function RateRow({ rate }: { rate: Rate }) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.currency}>
        {rate.unit === 1 ? rate.iso3 : `${rate.unit} ${rate.iso3}`}
      </ThemedText>
      <ThemedText style={styles.number}>{rate.buy.toFixed(2)}</ThemedText>
      <ThemedText style={styles.number}>{rate.sell.toFixed(2)}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  bsDate: {
    fontSize: 28,
    lineHeight: 40,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  currency: {
    flex: 1,
  },
  number: {
    width: 80,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
});
