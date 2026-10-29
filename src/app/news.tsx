import { Pressable, StyleSheet } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import { Card, Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useAsync } from '@/hooks/use-async';
import { fetchHeadlines, type Headline } from '@/lib/news';

export default function NewsScreen() {
  const news = useAsync(fetchHeadlines);

  return (
    <Screen
      title="समाचार"
      subtitle="Latest headlines. Tap one to read it on the publisher's site."
      refreshing={news.loading}
      onRefresh={news.reload}>
      {news.error && !news.data ? (
        <ThemedText themeColor="textSecondary">
          Could not load the news. Pull down to try again.
        </ThemedText>
      ) : null}
      {news.data?.map((item) => <HeadlineCard key={item.link} item={item} />)}
    </Screen>
  );
}

function HeadlineCard({ item }: { item: Headline }) {
  return (
    <ExternalLink href={item.link} asChild>
      <Pressable style={({ pressed }) => pressed && styles.pressed}>
        <Card>
          <ThemedText>{item.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {item.source.name}
            {item.publishedAt ? ` · ${timeAgo(item.publishedAt)}` : ''}
          </ThemedText>
        </Card>
      </Pressable>
    </ExternalLink>
  );
}

function timeAgo(time: number): string {
  const minutes = Math.max(0, Math.round((Date.now() - time) / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
});
