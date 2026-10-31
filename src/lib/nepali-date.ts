import NepaliDate from 'nepali-date-converter';

export type TodayInfo = {
  /** e.g. "बिहिबार, १२ कार्तिक २०८३" */
  bsNepali: string;
  /** e.g. "Thursday, 12 Kartik 2083" */
  bsEnglish: string;
  /** e.g. "29 October 2026" */
  ad: string;
};

/** Bikram Sambat and Gregorian labels for the device's local day. */
export function describeDay(date: Date): TodayInfo {
  const bs = new NepaliDate(date);
  return {
    bsNepali: bs.format('ddd, DD MMMM YYYY', 'np'),
    bsEnglish: bs.format('ddd, DD MMMM YYYY', 'en'),
    ad: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  };
}
