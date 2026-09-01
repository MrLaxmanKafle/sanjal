import type { Metadata } from "next";
import { Anek_Devanagari, Mukta } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

/*
 * Both faces are Devanagari-first designs that also carry Latin, so Nepali and
 * English render as one typographic system rather than English with Devanagari
 * bolted on. For an audience that reads both in the same sentence, that is a
 * product decision as much as an aesthetic one.
 */
const anek = Anek_Devanagari({
  variable: "--font-anek",
  subsets: ["latin", "devanagari"],
  display: "swap",
});

const mukta = Mukta({
  variable: "--font-mukta",
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} ${site.nameNepali}`,
    description: site.description,
    locale: "en",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anek.variable} ${mukta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
