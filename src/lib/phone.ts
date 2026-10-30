const DEVANAGARI_DIGITS = '०१२३४५६७८९';

/**
 * Turns whatever someone typed into an E.164 Nepali mobile number
 * (`+9779XXXXXXXXX`), or null when it is not one. Accepts spaces, dashes,
 * a leading 0, +977 / 977 prefixes and Devanagari digits.
 */
export function normalizeNepaliMobile(input: string): string | null {
  const ascii = input.replace(/[०-९]/g, (d) => String(DEVANAGARI_DIGITS.indexOf(d)));
  let digits = ascii.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  if (digits.startsWith('00977')) digits = digits.slice(5);
  else if (digits.startsWith('977')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  // Same rule as public.is_nepali_mobile in the database.
  return /^9[678]\d{8}$/.test(digits) ? `+977${digits}` : null;
}

/** `+9779812345678` → `981-234-5678` for display. */
export function formatNepaliMobile(e164: string): string {
  const local = e164.replace(/^\+?977/, '');
  return `${local.slice(0, 3)}-${local.slice(3, 6)}-${local.slice(6)}`;
}
