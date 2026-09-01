/**
 * City hubs.
 *
 * These ship EMPTY on purpose. The strategy is to hand-curate the first ten
 * cities with real organisers rather than fill the pages with plausible-looking
 * entries, because a directory that lists a restaurant that closed, or an event
 * that never happened, destroys the trust the guides are meant to build. An
 * honest empty hub with a working submission route is worth more than a
 * populated fake one.
 *
 * See docs/SEEDING.md for how to fill these in.
 */

export type Listing = {
  id: string;
  name: string;
  /** Restaurant, grocery, remittance agent, accountant, lawyer, and so on. */
  category: string;
  neighbourhood?: string;
  url?: string;
  /** Only ever true once a person has confirmed the business is trading. */
  confirmed: boolean;
};

export type CommunityEvent = {
  id: string;
  title: string;
  /** ISO date. Festival dates follow the lunar calendar and move each year. */
  date: string;
  venue?: string;
  organiser: string;
  url?: string;
};

export type Organisation = {
  name: string;
  kind: "society" | "nrna-chapter" | "student-association" | "other";
  url?: string;
};

export type City = {
  slug: string;
  name: string;
  nameNepali: string;
  country: string;
  /** Why this city is in the first cohort — keeps the choice accountable. */
  rationale: string;
  events: CommunityEvent[];
  listings: Listing[];
  organisations: Organisation[];
};

export const cities: City[] = [
  {
    slug: "sydney",
    name: "Sydney",
    nameNepali: "सिड्नी",
    country: "Australia",
    rationale:
      "One of the largest and fastest-growing Nepali student and settler populations, with long-established societies already running annual events.",
    events: [],
    listings: [],
    organisations: [],
  },
  {
    slug: "melbourne",
    name: "Melbourne",
    nameNepali: "मेलबर्न",
    country: "Australia",
    rationale:
      "Dense student population and an active association scene; pairs with Sydney so Australian features can be tested against two cities at once.",
    events: [],
    listings: [],
    organisations: [],
  },
  {
    slug: "london",
    name: "London",
    nameNepali: "लन्डन",
    country: "United Kingdom",
    rationale:
      "A long-settled community including Gurkha families, spread across many boroughs — a good test of whether a hub can serve a dispersed population.",
    events: [],
    listings: [],
    organisations: [],
  },
  {
    slug: "dallas-fort-worth",
    name: "Dallas–Fort Worth",
    nameNepali: "ड्यालस",
    country: "United States",
    rationale:
      "One of the most concentrated Nepali communities in the United States, with an unusually dense cluster of Nepali-owned businesses.",
    events: [],
    listings: [],
    organisations: [],
  },
  {
    slug: "boston",
    name: "Boston",
    nameNepali: "बोस्टन",
    country: "United States",
    rationale:
      "Large student intake each academic year, which makes it the clearest place to test the arrival-season needs: rooms, banking, first job.",
    events: [],
    listings: [],
    organisations: [],
  },
];

export function getCity(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug);
}

export function isSeeded(city: City): boolean {
  return city.events.length > 0 || city.listings.length > 0 || city.organisations.length > 0;
}
