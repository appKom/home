import { Metadata } from "next";
import { headers } from "next/headers";
import { projects } from "@/lib/projects";
import { projectType } from "@/lib/types";
import Custom404 from "@/app/not-found";
import Image from "next/image";
import { members } from "@/lib/members";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { MemberCard } from "@/components/home/MemberCard";
import { FaGithub, FaGlobe } from "react-icons/fa";

interface Params {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto");

  if (!host || !protocol) {
    return {
      title: "Error",
    };
  }

  const url = new URL(`${protocol}://${host}/artikkel/${params.id}`);
  const { pathname } = url;

  const parts = pathname.split("-");
  const title = decodeURIComponent(parts.slice(1).join("-"));

  return {
    title: `${title}`,
  };
}

export default async function ProjectPage({ params }: Params) {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto");

  const url = new URL(`${protocol}://${host}/prosjekt/${params.id}`);
  const { pathname } = url;

  const parts = pathname.split("/");
  const encodedProsjektTitle = parts[parts.length - 1] || "";
  const prosjektTitle = decodeURIComponent(encodedProsjektTitle ?? "");

  console.log(encodedProsjektTitle, prosjektTitle);

  const project: projectType | undefined = projects.find(
    (project) => project.title.toLowerCase() === prosjektTitle.toLowerCase()
  );

  if (!project) {
    return <Custom404 />;
  }

  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="w-full">
        <main className="flex flex-col">
          <div className="w-full flex justify-center">
            <Image
              src={project.imageUri}
              alt={`${project.title} illustrasjon`}
              width={1200}
              height={1200}
              className="w-full object-cover max-h-96"
            />
          </div>
          <div className="px-6">
            <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-semibold pt-8">
              {project.title}
            </h1>

            <div className="w-full flex justify-center py-6">
              <div className="w-full">
                {project.techStack && (
                  <div>
                    <h2 className="text-2xl font-bold">Teknologier</h2>
                    <ul className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <li
                          key={tech}
                          className="px-2 py-1 bg-gray-800 border border-gray-600 rounded-md"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2 pt-6 ">
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

            <article className="w-full break-words whitespace-pre-wrap pb-8">
              <ReactMarkdown className="w-full" rehypePlugins={[rehypeRaw]}>
                {project.description}
              </ReactMarkdown>
            </article>

            <h2 className="text-2xl font-bold">Utviklerne</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 w-full gap-4 pt-6">
              {project.people.map((person) => {
                const member = members.find(
                  (member) =>
                    member.href.toLowerCase() === person.name.toLowerCase()
                );
                if (member) {
                  const isProjectLead = !!project.people.find(
                    (person) =>
                      person.role === "Prosjektleder" &&
                      person.name.toLowerCase() === member.href.toLowerCase()
                  );

                  return (
                    <MemberCard
                      key={member.name}
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
