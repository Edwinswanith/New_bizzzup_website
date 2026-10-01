import type { Metadata } from "next";

const LOCAL_ORIGIN = "http://localhost:3000";

function env(name: string) {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function normalizeOrigin(value: string | undefined) {
  if (!value) return LOCAL_ORIGIN;
  const trimmed = value.replace(/\/+$/, "");
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(trimmed);
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `${local ? "http" : "https"}://${trimmed}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return LOCAL_ORIGIN;
  }
}

export const SITE = {
  name: "Tech Cogniverse",
  // Set NEXT_PUBLIC_SITE_URL to the custom production domain. On Vercel, the production URL is used as a safe fallback.
  url: normalizeOrigin(env("NEXT_PUBLIC_SITE_URL") || env("VERCEL_PROJECT_PRODUCTION_URL") || env("VERCEL_URL")),
  locale: "en_GB",
  title: "Tech Cogniverse · AI systems and product engineering for UK teams",
  description:
    "Tech Cogniverse builds AI agents, voice systems, RAG platforms and custom business software for UK teams. Live in 45 days, fixed price, demo every Friday.",
};

export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Tech Cogniverse - AI systems and product engineering for UK teams",
};

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE.url}/`).toString();
}

export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: SITE.name, locale: SITE.locale, images: [OG_IMAGE] },
    twitter: { title, description, card: "summary_large_image", images: [OG_IMAGE.url] },
  };
}
