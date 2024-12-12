import { prisma } from "@/lib/prisma";
import { projects } from "@/lib/projects";
import { memberType } from "@/lib/types";
import { getAllMembers } from "@/lib/utils/getRelevantMembers";
import type { MetadataRoute } from "next";

export const revalidate = 36000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://appkom.no";

  const blogs = await prisma.article.findMany();
  const members: memberType[] = getAllMembers();

  return [
    {
      url: `${baseUrl}/om`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/prosjekt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogg`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/medlem`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...members.map((member): MetadataRoute.Sitemap[number] => ({
      url: `${baseUrl}/medlem/${member.href}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    })),
    ...projects.map((project): MetadataRoute.Sitemap[number] => ({
      url: `${baseUrl}/prosjekt/${encodeURIComponent(project.title)}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    })),
    ...blogs.map((blog): MetadataRoute.Sitemap[number] => ({
      url: `${baseUrl}/blogg/${encodeURIComponent(blog.title)}`,
      lastModified: blog.updatedAt || new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    })),
  ];
}
