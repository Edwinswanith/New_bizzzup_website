import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { PROJECTS } from "@/content/projects";
import { SERVICES } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({
    url: absoluteUrl(path),
    lastModified: updated,
    changeFrequency,
    priority,
  });
  return [
    page("/", 1, "weekly"),
    page("/work", 0.9, "weekly"),
    page("/services", 0.9, "monthly"),
    page("/process", 0.8, "monthly"),
    page("/about", 0.6, "monthly"),
    page("/privacy-policy", 0.3, "yearly"),
    page("/content-rights", 0.3, "yearly"),
    ...SERVICES.map((s) => page(`/services/${s.slug}`, 0.75, "monthly")),
    ...PROJECTS.map((p) => page(`/work/${p.slug}`, 0.7, "monthly")),
  ];
}
