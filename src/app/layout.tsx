import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Martian_Mono } from "next/font/google";
import "./globals.css";
import { OG_IMAGE, SITE } from "@/lib/site";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-display", display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--f-body", display: "swap" });
const mono = Martian_Mono({ subsets: ["latin"], variable: "--f-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE.name, locale: SITE.locale, url: "/", title: SITE.title, description: SITE.description, images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description, images: [OG_IMAGE.url] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#e6e9ea", colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Scroll-driven pages show their resolved, static state unless script can run. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js=''" }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
