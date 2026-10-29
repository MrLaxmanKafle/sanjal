export type FeedItem = {
  title: string;
  link: string;
  /** Milliseconds since epoch, or null when the feed gives no usable date. */
  publishedAt: number | null;
};

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decode(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m)
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function tag(block: string, name: string): string | null {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return match ? decode(match[1]) : null;
}

/**
 * A small RSS 2.0 reader: titles, links and dates only. Items without a
 * title or an http(s) link are dropped rather than shown half-broken.
 */
export function parseRss(xml: string): FeedItem[] {
  const items: FeedItem[] = [];
  for (const [, block] of xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)) {
    const title = tag(block, 'title');
    const link = tag(block, 'link');
    if (!title || !link || !/^https?:\/\//.test(link)) continue;
    const date = tag(block, 'pubDate');
    const time = date ? Date.parse(date) : NaN;
    items.push({ title, link, publishedAt: Number.isNaN(time) ? null : time });
  }
  return items;
}
