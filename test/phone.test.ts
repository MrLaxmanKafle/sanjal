import assert from 'node:assert/strict';
import { test } from 'node:test';

import { formatNepaliMobile, normalizeNepaliMobile } from '../src/lib/phone.ts';

test('accepts the ways people write Nepali mobile numbers', () => {
  for (const input of ['9812345678', '981-234-5678', '+977 9812345678', '977-981-2345678', '009779812345678', '09812345678', '९८१२३४५६७८']) {
    assert.equal(normalizeNepaliMobile(input), '+9779812345678', input);
  }
  assert.equal(normalizeNepaliMobile('9741234567'), '+9779741234567');
  assert.equal(normalizeNepaliMobile('9611234567'), '+9779611234567');
});

test('rejects landlines, short numbers and foreign numbers', () => {
  for (const input of ['014412345', '981234567', '98123456789', '+61 412 345 678', '9512345678', '']) {
    assert.equal(normalizeNepaliMobile(input), null, input);
  }
});

test('formats for display', () => {
  assert.equal(formatNepaliMobile('+9779812345678'), '981-234-5678');
});
