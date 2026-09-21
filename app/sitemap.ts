import type { MetadataRoute } from "next";

const baseUrl = "https://www.sge.org.in";

const routes = [
  "",
  "/about",
  "/team",
  "/careers",
  "/partner",
  "/pricing",
  "/clients",
  "/academy",
  "/compliance",
  "/blog",
  "/help",
  "/help/account-recovery",
  "/help/password-reset",
  "/help/complaints",
  "/privacy",
  "/terms",
  "/bucket",
  "/search"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));
}
