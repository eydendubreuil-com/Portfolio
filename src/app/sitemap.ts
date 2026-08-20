import type { MetadataRoute } from "next";
import { site } from "@/content/site.config";
import { projectDetails } from "@/content/project-chapters";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.url}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${site.url}/projets`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Chaque chapitre est une page réelle : il a sa place dans le plan du site.
    // `/projets/{slug}` n'y figure pas — c'est une redirection vers le chapitre 1.
    ...projectDetails.flatMap((p) =>
      p.chapters.map((c) => ({
        url: `${site.url}/projets/${p.slug}/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: c.n === 1 ? 0.7 : 0.5,
      })),
    ),
  ];
}
