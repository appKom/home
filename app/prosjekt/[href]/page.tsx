import { Metadata } from "next";
import { hrefParams } from "@/lib/types";
import Custom404 from "@/app/not-found";
import Image from "next/image";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { MemberCard } from "@/components/home/MemberCard";
import { FaGithub, FaGlobe } from "react-icons/fa";
import { HeaderText } from "@/components/headerText";
import { prisma } from "@/lib/prisma";
import MarkdownComponents from "@/components/Markdown";

export async function generateMetadata(props: {
  params: hrefParams;
}): Promise<Metadata> {
  const { href } = await props.params;
  const decodedHref = decodeURIComponent(href);

  const project = await prisma.project.findUnique({
    where: { href: decodedHref },
    include: { projectMembers: { include: { Member: true } } },
  });

  if (!project) {
    return {
      title: "Prosjektet ble ikke funnet",
    };
  }

  const description =
    project.shortDescription ||
    (project.description
      ? project.description.replace(/[#*`]/g, "").slice(0, 160).trim()
      : `${project.title} - Et prosjekt av Appkom`);

  const projectLead = project.projectMembers.find(
    (pm) => pm.Role === "Prosjektleder",
  )?.Member;

  const teamMembers = project.projectMembers
    .filter((pm) => pm.Member)
    .map((pm) => pm.Member.name);

  const techKeywords = project.techStack
    ? project.techStack.split(",").map((tech) => tech.trim())
    : [];

  return {
    title: `${project.title} | Prosjekt | Appkom`,
    description: description,
    openGraph: {
      title: project.title,
      description: description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/prosjekt/${project.href}`,
      images: [
        {
          url: project.imageUri,
          width: 1200,
          height: 630,
          alt: `${project.title} prosjektbilde`,
        },
      ],
      siteName: "Appkom",
      locale: "no_NO",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: description,
      images: [project.imageUri],
      creator: projectLead
        ? `@${projectLead.name.replace(/\s+/g, "")}`
        : undefined,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/prosjekt/${project.href}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    authors: teamMembers.map((name) => ({ name })),
    keywords: [
      "Appkom",
      "Prosjekt",
      project.title,
      "NTNU",
      "Studentprosjekt",
      "Informatikk",
      "Linjeforening",
      ...techKeywords,
    ],
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://appkom.no",
    ),
    other: {
      "og:project:technologies": project.techStack || "",
      "og:project:github": project.github,
      ...(project.link && { "og:project:website": project.link }),
    },
  };
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    select: { href: true },
  });

  return projects.map((project) => ({
    href: project.href,
  }));
}
export default async function ProjectPage(props: { params: hrefParams }) {
  const { href } = await props.params;

  const decodedHref = decodeURIComponent(href);

  const project = await prisma.project.findUnique({
    where: { href: decodedHref },
    include: { projectMembers: { include: { Member: true } } },
  });

  if (!project) {
    return <Custom404 />;
  }

  return (
    <div className="flex min-h-screen w-full justify-center">
      <div className="w-full">
        <main className="flex flex-col">
          <div className="flex w-full justify-center">
            <Image
              src={project.imageUri}
              alt={`${project.title} illustrasjon`}
              width={1200}
              height={1200}
              className="max-h-96 w-full object-cover"
            />
          </div>
          <div className="px-6">
            <div className="pt-8">
              <HeaderText title={project.title} />
            </div>

            <div className="flex w-full justify-center py-6">
              <div className="w-full">
                {project.techStack && (
                  <div>
                    <h2 className="text-2xl font-bold">Teknologier</h2>
                    <ul className="flex flex-wrap gap-2">
                      {project.techStack.split(",").map((tech) => (
                        <li
                          key={tech}
                          className="rounded-md border border-gray-600 bg-gray-800 px-2 py-1"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex flex-col gap-2 pt-6 sm:flex-row">
                  {project.link && (
                    <a
                      className="flex flex-row gap-2 hover:text-onlineOrange"
                      href={project.link}
                      target="_blank"
                    >
                      <FaGlobe size={24} />
                      <p>{project.link.split("https://")}</p>
                    </a>
                  )}
                  <a
                    className="flex flex-row gap-2 hover:text-onlineOrange"
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaGithub size={24} />
                    <p>{project.github.split("https://github.com")}</p>
                  </a>
                </div>
              </div>
            </div>

            <article className="overflow-wrap break-word w-full overflow-x-auto whitespace-pre-wrap break-words pb-8">
              <ReactMarkdown
                className="w-full"
                rehypePlugins={[rehypeRaw]}
                components={MarkdownComponents}
              >
                {project.description}
              </ReactMarkdown>
            </article>

            <h2 className="text-2xl font-bold">Utviklerne</h2>
            <div className="grid w-full grid-cols-2 gap-4 pt-6 sm:grid-cols-2 md:grid-cols-4">
              {project.projectMembers.map((person) => {
                const member = person.Member;

                if (member) {
                  const isProjectLead = project.projectMembers.some(
                    (pm) =>
                      pm.Role === "Prosjektleder" && pm.Member.id === member.id,
                  );

                  return (
                    <MemberCard
                      key={member.id}
                      member={member}
                      hideRole={true}
                      isProjectLead={isProjectLead}
                      period={""}
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
