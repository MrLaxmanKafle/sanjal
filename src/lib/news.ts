import { parseRss, type FeedItem } from './rss';

export type NewsSource = {
  id: string;
  name: string;
  feedUrl: string;
};

/**
 * Headlines only: we show the title and send readers to the publisher.
 * Never store or republish article bodies.
 */
export const SOURCES: NewsSource[] = [
  { id: 'onlinekhabar', name: 'Onlinekhabar', feedUrl: 'https://www.onlinekhabar.com/feed' },
  { id: 'setopati', name: 'Setopati', feedUrl: 'https://www.setopati.com/feed' },
  { id: 'ratopati', name: 'Ratopati', feedUrl: 'https://www.ratopati.com/feed' },
];

export type Headline = FeedItem & { source: NewsSource };

/** Merges every source's latest headlines, newest first. A failing source is skipped, not fatal. */
export async function fetchHeadlines(perSource = 15): Promise<Headline[]> {
  const results = await Promise.allSettled(
    SOURCES.map(async (source) => {
      const res = await fetch(source.feedUrl);
      if (!res.ok) throw new Error(`${source.name} returned ${res.status}`);
      return parseRss(await res.text())
        .slice(0, perSource)
        .map((item) => ({ ...item, source }));
    }),
  );

  const headlines = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
  if (headlines.length === 0) throw new Error('Could not reach any news source');
  return headlines.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
}
