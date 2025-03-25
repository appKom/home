import { Metadata } from "next";
import { hrefParams, tParams } from "@/lib/types";
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
  params: tParams;
}): Promise<Metadata> {
  const { id } = await props.params;

  const project = id;

  return {
    title: `${project}`,
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
