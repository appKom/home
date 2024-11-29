import { blogs } from "@/lib/blog";
import { members } from "@/lib/members";
import { projects } from "@/lib/projects";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://appkom.no";

  return [
    {
      url: baseUrl + "/om",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: baseUrl + "/prosjekt",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: baseUrl + "/blogg",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: baseUrl + "/kontakt",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: baseUrl + "/medlem",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...members.map((member): MetadataRoute.Sitemap[number] => ({
      url: baseUrl + member.href,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    })),
    ...projects.map((project): MetadataRoute.Sitemap[number] => ({
      url: baseUrl + "/prosjekt/" + encodeURI(project.title),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    })),
    ...blogs.map((blog): MetadataRoute.Sitemap[number] => ({
      url: baseUrl + "/blogg/" + encodeURI(blog.title),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    })),
  ];
}
