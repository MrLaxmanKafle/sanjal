import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseRss } from '../src/lib/rss.ts';

const FEED = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>Example</title>
  <item>
    <title><![CDATA[काठमाडौंमा &amp; बाढी]]></title>
    <link>https://example.com/a</link>
    <pubDate>Thu, 29 Oct 2026 06:15:00 +0000</pubDate>
  </item>
  <item>
    <title>Budget &#8216;passed&#8217;</title>
    <link>https://example.com/b</link>
  </item>
  <item><title>No link</title></item>
  <item><title>Bad link</title><link>javascript:alert(1)</link></item>
</channel></rss>`;

test('reads titles, links and dates, decoding CDATA and entities', () => {
  const items = parseRss(FEED);
  assert.equal(items.length, 2);
  assert.deepEqual(items[0], {
    title: 'काठमाडौंमा & बाढी',
    link: 'https://example.com/a',
    publishedAt: Date.parse('2026-10-29T06:15:00Z'),
  });
  assert.equal(items[1].title, 'Budget ‘passed’');
  assert.equal(items[1].publishedAt, null);
});

test('drops items without a title or a safe link', () => {
  assert.ok(parseRss(FEED).every((i) => i.link.startsWith('https://')));
});

test('returns nothing for a non-feed', () => {
  assert.deepEqual(parseRss('<html><body>blocked</body></html>'), []);
});
