import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseNrbRates } from '../src/lib/forex.ts';

const rate = (iso3: string, unit: number, buy: string, sell: string) => ({
  currency: { iso3, name: iso3, unit },
  buy,
  sell,
});

test('takes the latest day and puts remittance currencies first', () => {
  const parsed = parseNrbRates({
    status: { code: 200 },
    data: {
      payload: [
        { date: '2026-10-28', rates: [rate('USD', 1, '130.00', '130.60')] },
        {
          date: '2026-10-29',
          rates: [rate('EUR', 1, '150.10', '150.80'), rate('JPY', 10, '9.10', '9.14'), rate('USD', 1, '133.20', '133.80')],
        },
      ],
    },
  });

  assert.equal(parsed?.date, '2026-10-29');
  assert.deepEqual(
    parsed?.rates.map((r) => r.iso3),
    ['USD', 'JPY', 'EUR'],
  );
  assert.deepEqual(parsed?.rates[1], { iso3: 'JPY', name: 'JPY', unit: 10, buy: 9.1, sell: 9.14 });
});

test('skips malformed rows and returns null for an empty response', () => {
  const parsed = parseNrbRates({
    data: { payload: [{ date: '2026-10-29', rates: [rate('USD', 1, 'n/a', '1'), rate('GBP', 1, '170', '171')] }] },
  });
  assert.deepEqual(parsed?.rates.map((r) => r.iso3), ['GBP']);
  assert.equal(parseNrbRates({ data: { payload: [] } }), null);
  assert.equal(parseNrbRates(null), null);
});
