/**
 * Nepal Rastra Bank publishes the official reference rates once a day.
 * API docs: https://www.nrb.org.np/api-docs/
 */

export type Rate = {
  iso3: string;
  name: string;
  /** Rates are quoted per `unit` of the foreign currency (e.g. 10 for JPY). */
  unit: number;
  buy: number;
  sell: number;
};

export type DailyRates = {
  date: string;
  rates: Rate[];
};

/** Currencies most Nepali households deal with, in display order. */
export const FEATURED = ['USD', 'QAR', 'SAR', 'AED', 'MYR', 'KRW', 'JPY', 'AUD', 'GBP', 'EUR', 'INR'];

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Pulls the most recent day out of an NRB `/forex/v1/rates` response. Returns null when it has none. */
export function parseNrbRates(json: unknown): DailyRates | null {
  const payload = (json as { data?: { payload?: unknown } })?.data?.payload;
  if (!Array.isArray(payload) || payload.length === 0) return null;

  const latest = [...payload].sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
  if (!Array.isArray(latest?.rates)) return null;

  const rates: Rate[] = [];
  for (const r of latest.rates) {
    const iso3 = r?.currency?.iso3;
    const buy = Number(r?.buy);
    const sell = Number(r?.sell);
    if (typeof iso3 !== 'string' || !Number.isFinite(buy) || !Number.isFinite(sell)) continue;
    rates.push({
      iso3,
      name: String(r.currency.name ?? iso3),
      unit: Number(r.currency.unit) || 1,
      buy,
      sell,
    });
  }

  const rank = (iso3: string) => {
    const i = FEATURED.indexOf(iso3);
    return i === -1 ? FEATURED.length : i;
  };
  rates.sort((a, b) => rank(a.iso3) - rank(b.iso3) || a.iso3.localeCompare(b.iso3));

  return { date: String(latest.date), rates };
}

/** Fetches the latest published rates, looking back a week to cover holidays. */
export async function fetchRates(now = new Date()): Promise<DailyRates> {
  const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const url =
    'https://www.nrb.org.np/api/forex/v1/rates' +
    `?page=1&per_page=10&from=${isoDate(from)}&to=${isoDate(now)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Nepal Rastra Bank returned ${res.status}`);
  const rates = parseNrbRates(await res.json());
  if (!rates) throw new Error('No exchange rates published this week');
  return rates;
}
