import { blogs } from "@/lib/blog";
import { members } from "@/lib/members";
import { projects } from "@/lib/projects";
import { create } from "xmlbuilder2";

export async function GET() {
  const paths = ["/", "/prosjekt", "/blogg", "/kontakt", "/om"];

  members.forEach((member) => {
    paths.push(member.href);
  });

  projects.forEach((project) => {
    paths.push(`/prosjekt/${project.title}`);
  });

  blogs.forEach((blog) => {
    paths.push(`/blogg/${blog.title}`);
  });

  const sitemap = create({ version: "1.0", encoding: "UTF-8" }).ele("urlset", {
    xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
  });

  paths.forEach((path) => {
    sitemap.ele("url").ele("loc").txt(`https://appkom.no${path}`).up().up();
  });

  const xmlOutput = sitemap.end({ prettyPrint: true });

  return new Response(xmlOutput, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
