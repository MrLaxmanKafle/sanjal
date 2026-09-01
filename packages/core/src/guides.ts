/**
 * Life-admin guides — the wedge.
 *
 * PROVENANCE IS PART OF THE CONTENT MODEL. A guide that quietly goes stale is
 * worse than no guide: someone books flights around it. Every guide therefore
 * carries a `review` block, and the UI refuses to present an unverified guide
 * as settled fact. Never set `status: "verified"` from memory — only after a
 * named person has checked the listed official sources on the stated date.
 *
 * Deliberate editorial rule: we describe the *shape* of a process (what it is,
 * what you will be asked for, what order things happen in, what goes wrong)
 * and always send the reader to the official source for fees, forms and
 * appointment slots, which change without notice and differ per mission.
 */

export type ReviewStatus = "verified" | "unverified";

export type Review = {
  status: ReviewStatus;
  /** ISO date the sources below were last opened and checked. */
  lastChecked: string | null;
  /** Who checked. Keeps accountability on a real name, not "the team". */
  checkedBy: string | null;
};

export type GuideSource = {
  label: string;
  url: string;
};

export type GuideStep = {
  title: string;
  body: string;
};

export type Guide = {
  slug: string;
  title: string;
  titleNepali: string;
  /** One line, plain language, answers "is this the page I need?" */
  summary: string;
  /** Who this is for — helps people self-select out fast. */
  audience: string;
  /** Rough end-to-end time, always hedged. */
  typicalTimeline: string;
  /** Lead time before the deadline you should start. Drives vault prompts. */
  startBefore: string;
  documents: string[];
  steps: GuideStep[];
  pitfalls: string[];
  sources: GuideSource[];
  review: Review;
  /** Sensitive topics get a gentler introduction and no "tips" framing. */
  tone?: "practical" | "bereavement";
};

const unverified: Review = {
  status: "unverified",
  lastChecked: null,
  checkedBy: null,
};

export const guides: Guide[] = [
  {
    slug: "nepali-passport-renewal-abroad",
    title: "Renewing a Nepali passport from abroad",
    titleNepali: "विदेशबाट नेपाली राहदानी नवीकरण",
    summary:
      "How the e-passport renewal works when you apply through a Nepali embassy or consulate instead of a district office at home.",
    audience:
      "Anyone holding a Nepali passport that expires within the next year while living outside Nepal.",
    typicalTimeline:
      "Commonly several weeks to a few months, because most missions forward applications to the Department of Passports in Kathmandu and wait for the booklet to be printed and shipped back.",
    startBefore:
      "Six months before expiry. Many countries will not renew a visa or residence permit on a passport with under six months validity, so the passport deadline usually arrives before you think it does.",
    documents: [
      "Your current passport, plus photocopies of the data page",
      "Proof that you are lawfully resident in the country you are applying from (visa, residence card, or student permit)",
      "Nepali citizenship certificate, and a photocopy",
      "A completed application form from your mission's website",
      "Photographs meeting the mission's stated specification",
      "The fee, in the exact payment method the mission accepts",
    ],
    steps: [
      {
        title: "Find your own mission first",
        body:
          "Nepal's missions cover fixed groups of countries, and the one nearest you geographically is not always the one responsible for you. Confirm which embassy or consulate covers your country of residence before you prepare anything, because the form, the fee and the payment method are all set per mission.",
      },
      {
        title: "Check whether biometrics must be given in person",
        body:
          "The e-passport records biometric data. Missions differ in whether they collect this themselves, run mobile camps in cities far from the embassy, or require a visit in person. This single question decides whether your renewal is a postal errand or a trip, so settle it early.",
      },
      {
        title: "Book the appointment, if your mission uses appointments",
        body:
          "Where slots are released online they can be scarce, which is part of why lead time matters. Take the earliest workable slot rather than the most convenient one.",
      },
      {
        title: "Submit, pay, and keep the receipt",
        body:
          "Keep the acknowledgement or tracking reference somewhere you will still find it in three months. It is the only thing that lets you chase the application later.",
      },
      {
        title: "Plan for the gap while your passport is away",
        body:
          "If the mission keeps your old passport during processing, you cannot travel internationally in that window, and you may not be able to complete visa or banking steps that need the physical booklet. Do not book travel until it is back in your hands.",
      },
    ],
    pitfalls: [
      "Leaving it until under six months of validity remain, then discovering your visa renewal is blocked by the same deadline.",
      "Preparing paperwork for the wrong mission — coverage follows assigned countries, not distance.",
      "Assuming the fee can be paid by card. Several missions accept only specific methods such as a bank draft or money order.",
      "A name, date of birth or spelling that does not match your citizenship certificate. Mismatches are the most common cause of a rejected file, and fixing one is a separate process.",
    ],
    sources: [
      { label: "Department of Passports, Government of Nepal", url: "https://nepalpassport.gov.np/" },
      { label: "Ministry of Foreign Affairs — Nepali missions abroad", url: "https://mofa.gov.np/" },
    ],
    review: unverified,
  },
  {
    slug: "no-objection-certificate",
    title: "Getting a No Objection Certificate (NOC)",
    titleNepali: "अनापत्ति प्रमाणपत्र (NOC)",
    summary:
      "What the NOC is, when a Nepali student or worker actually needs one, and what the issuing office will ask you to prove.",
    audience:
      "Students heading abroad to study, and families arranging the paperwork from Nepal on their behalf.",
    typicalTimeline:
      "Usually short once the file is complete — the delay is almost always in assembling the supporting documents, not in the decision.",
    startBefore:
      "As soon as you hold an offer letter, and well before any visa appointment that lists the NOC as a required document.",
    documents: [
      "Offer or admission letter from the institution abroad",
      "Academic transcripts and certificates, with the equivalence or verification your case requires",
      "Passport and citizenship certificate, with photocopies",
      "Evidence of how the studies will be funded",
    ],
    steps: [
      {
        title: "Confirm you need one at all",
        body:
          "The NOC is tied to specific purposes, most commonly studying abroad. Requirements differ by destination country and by the type of programme, so check against your own case rather than a friend's.",
      },
      {
        title: "Get your academic documents verified in the right order",
        body:
          "Verification of transcripts by the awarding body and the relevant ministry is usually a prerequisite, not a parallel task. Starting it late is the single biggest cause of a missed visa appointment.",
      },
      {
        title: "Apply through the current official channel",
        body:
          "Nepal has moved several of these processes online in recent years and the entry point has changed more than once. Use the Ministry of Education's current portal rather than a link saved from an older attempt.",
      },
      {
        title: "Keep digital copies of everything you submit",
        body:
          "You will be asked for the same documents again by the embassy, the institution, and sometimes a bank. One clearly named folder saves the whole year.",
      },
    ],
    pitfalls: [
      "Treating the NOC as the first step. It normally sits after document verification, and the ordering matters.",
      "Using an agent's photocopies rather than holding your own originals and scans.",
      "Following instructions from an out-of-date forum post — this process has changed repeatedly.",
    ],
    sources: [
      { label: "Ministry of Education, Science and Technology", url: "https://moest.gov.np/" },
    ],
    review: unverified,
  },
  {
    slug: "power-of-attorney-from-abroad",
    title: "Power of attorney for property or legal matters in Nepal",
    titleNepali: "अधिकृत वारेसनामा",
    summary:
      "How to authorise someone in Nepal to act for you — the adhikrit warisnama — when you cannot travel home to sign in person.",
    audience:
      "Anyone abroad who needs a relative to sell, transfer, register or defend property, or to represent them in a case at home.",
    typicalTimeline:
      "Weeks rather than days, because the document is normally executed at a Nepali mission and then has to physically reach the office in Nepal that will act on it.",
    startBefore:
      "Two to three months before the transaction date, and earlier if the document must be posted to Nepal.",
    documents: [
      "Your passport and citizenship certificate",
      "Full legal details of the person you are authorising, exactly as written on their citizenship certificate",
      "Precise details of the property or matter, including plot and registration numbers where relevant",
      "The specific powers you intend to grant, written out",
    ],
    steps: [
      {
        title: "Decide exactly what you are authorising",
        body:
          "A power of attorney is not a general licence. Write down the specific acts you intend to allow. Narrow, precise wording protects you; broad wording is how family property disputes start.",
      },
      {
        title: "Have it prepared in the form Nepal will accept",
        body:
          "The wording and format are not freeform. Get the draft prepared by someone who works with Nepali land and court offices, before you take it to the mission.",
      },
      {
        title: "Execute it at your Nepali mission",
        body:
          "Signing and attestation is normally done in person at the embassy or consulate covering your country, with your original documents present.",
      },
      {
        title: "Send the original to Nepal and confirm it was accepted",
        body:
          "The office in Nepal acts on the original, not a scan. Use a trackable courier, and ask your representative to confirm in writing that the receiving office accepted the document before anyone relies on it.",
      },
    ],
    pitfalls: [
      "Granting broader powers than the transaction needs, and having no simple way to withdraw them later.",
      "A spelling of a name that differs between the citizenship certificate and the deed. Nepali land offices are strict about this and it will stop the file.",
      "Assuming a document notarised locally in your country of residence will be accepted in Nepal without the mission's involvement.",
      "Not agreeing in advance, in writing, how and when the authority ends.",
    ],
    sources: [
      { label: "Department of Consular Services", url: "https://consular.gov.np/" },
      { label: "Ministry of Foreign Affairs — Nepali missions abroad", url: "https://mofa.gov.np/" },
    ],
    review: unverified,
  },
  {
    slug: "police-clearance-certificate",
    title: "Nepal police clearance certificate from abroad",
    titleNepali: "प्रहरी प्रमाणपत्र",
    summary:
      "The certificate immigration authorities and employers abroad ask for as proof of your record in Nepal, and how to obtain it without flying home.",
    audience:
      "Anyone applying for permanent residency, citizenship, a professional licence or certain jobs abroad.",
    typicalTimeline:
      "Several weeks is common when applying from outside Nepal, longer if fingerprints have to be taken locally and posted.",
    startBefore:
      "Three months before the date your application is due, and check its validity period — many authorities reject a certificate older than six months.",
    documents: [
      "Passport, and photocopies of the data page",
      "Nepali citizenship certificate",
      "Fingerprints taken on the form the receiving authority specifies, where required",
      "Details of your addresses in Nepal",
      "Proof of the purpose, such as the letter from the authority requesting the certificate",
    ],
    steps: [
      {
        title: "Ask the requesting authority exactly what they need",
        body:
          "Different immigration systems want different things: some accept a certificate obtained through a Nepali mission, others demand the fingerprint form on their own template. Get their specification in writing first — it determines every later step.",
      },
      {
        title: "Route the request through your mission or an authorised representative",
        body:
          "From abroad the request usually goes through your Nepali mission, or through someone acting for you in Nepal under a power of attorney.",
      },
      {
        title: "Have fingerprints taken to the right specification, if required",
        body:
          "Where prints are needed they generally must be taken by an authorised body such as a local police service, on the specified card.",
      },
      {
        title: "Check the certificate before you submit it",
        body:
          "Confirm your name, passport number and date of birth match your other documents exactly, and note the issue date so you can track its validity window.",
      },
    ],
    pitfalls: [
      "Obtaining the certificate too early and having it expire before the application is decided.",
      "Fingerprints taken on the wrong form, which usually means starting again.",
      "Names that differ between passport and citizenship certificate.",
    ],
    sources: [
      { label: "Nepal Police", url: "https://nepalpolice.gov.np/" },
      { label: "Department of Consular Services", url: "https://consular.gov.np/" },
    ],
    review: unverified,
  },
  {
    slug: "nrn-card",
    title: "Non-Resident Nepali (NRN) identity card",
    titleNepali: "गैरआवासीय नेपाली परिचयपत्र",
    summary:
      "What the NRN card is for, who is eligible, and why people apply for one before dealing with property or investment in Nepal.",
    audience:
      "Nepalis who have taken foreign citizenship, and Nepali citizens who have lived abroad long-term.",
    typicalTimeline: "Varies by where you apply and how quickly supporting documents can be assembled.",
    startBefore:
      "Well before any transaction in Nepal that depends on the status the card evidences.",
    documents: [
      "Foreign passport, or Nepali passport plus proof of long-term residence abroad",
      "Evidence of prior Nepali citizenship or Nepali descent, such as your own or a parent's citizenship certificate",
      "Proof of your current address abroad",
      "Photographs to the stated specification",
    ],
    steps: [
      {
        title: "Establish which category you fall into",
        body:
          "The framework distinguishes between people of Nepali origin who now hold foreign citizenship and Nepali citizens residing abroad. The category determines eligibility, the documents required, and what the card actually permits.",
      },
      {
        title: "Assemble proof of Nepali origin",
        body:
          "This is the part that takes time. Older family documents may need to be located in Nepal and, in some cases, verified. Start here rather than with the form.",
      },
      {
        title: "Apply through the official channel for your country",
        body:
          "Applications are handled via Nepali missions and the responsible department, with NRNA chapters often assisting. Confirm the current route for your country before paying anyone.",
      },
    ],
    pitfalls: [
      "Assuming the card confers rights it does not. Check what it actually permits for your specific plan — particularly for land and property, where restrictions apply.",
      "Paying an intermediary before confirming the official process and fee.",
    ],
    sources: [
      { label: "Non-Resident Nepali Association (NRNA)", url: "https://nrna.org/" },
      { label: "Department of Consular Services", url: "https://consular.gov.np/" },
    ],
    review: unverified,
  },
  {
    slug: "repatriation-of-remains",
    title: "Bringing a family member home to Nepal after a death abroad",
    titleNepali: "मृत्यु पश्चात् नेपाल फिर्ता ल्याउने प्रक्रिया",
    summary:
      "The steps and the people who can help when a Nepali dies abroad and the family wants the body returned home.",
    audience:
      "Families and friends handling a death abroad, and community volunteers helping them.",
    typicalTimeline:
      "Usually one to several weeks. It depends on the cause of death, whether an investigation or post-mortem is required, and how quickly the airline and both governments complete their part.",
    startBefore:
      "There is no lead time here. Contact the nearest Nepali mission and the employer or insurer as early as you are able.",
    documents: [
      "The death certificate issued locally",
      "The deceased's passport and, where available, citizenship certificate",
      "Medical certificate stating the cause of death",
      "Embalming and non-contagious disease certificates required for air transport",
      "Police or coroner clearance where the death is under investigation",
      "Proof of the next of kin's relationship, and their written consent",
    ],
    steps: [
      {
        title: "Contact the Nepali mission covering that country",
        body:
          "The mission is the central point for the documents that let a body travel, and can advise on what the destination and departure authorities each require. Ask them directly what they need from the family.",
      },
      {
        title: "Ask about welfare funds the family may be entitled to",
        body:
          "For workers who went through Nepal's foreign employment system, support toward repatriation and compensation may exist through the Foreign Employment Board. Employers and insurers may also carry obligations. These questions are easy to miss in the first days and hard to reopen later.",
      },
      {
        title: "Work with a funeral director experienced in international transfer",
        body:
          "Air transport of remains has strict documentary and packaging requirements. A funeral director who has done this route before will coordinate embalming, certification and the airline booking.",
      },
      {
        title: "Confirm who is receiving the person in Nepal",
        body:
          "Someone must be named to complete arrival formalities at the airport in Kathmandu. Agree this early with the family so the arrival is not held up.",
      },
    ],
    pitfalls: [
      "Paying a private intermediary before checking what the mission, the employer, the insurer or the welfare fund will already cover.",
      "Booking flights before the medical and clearance documents exist.",
      "Leaving one exhausted family member to carry the whole process alone — this is the moment a city community can genuinely take work off a family.",
    ],
    sources: [
      { label: "Ministry of Foreign Affairs — Nepali missions abroad", url: "https://mofa.gov.np/" },
      { label: "Foreign Employment Board", url: "https://fewb.gov.np/" },
    ],
    review: unverified,
    tone: "bereavement",
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}
