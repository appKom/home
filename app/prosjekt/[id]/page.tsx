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
      <div className="w-full max-w-screen-lg text-gray-700">
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

          {project.techStack && (
            <div className="w-full flex justify-center py-6">
              <div className="w-full max-w-screen-lg">
                <h2 className="text-2xl font-bold">Teknologier</h2>
                <ul className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <li key={tech} className="px-2 py-1 bg-gray-200 rounded-md">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <article className="w-full break-words whitespace-pre-wrap px-6 py-12">
            <ReactMarkdown className="w-full" rehypePlugins={[rehypeRaw]}>
              {project.description}
            </ReactMarkdown>
          </article>

          <h2 className="text-2xl font-bold">Utviklerne</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 w-full gap-4">
            {project.people.map((person) => {
              const member = members.find(
                (member) =>
                  member.href.toLowerCase() === person.name.toLowerCase()
              );
              if (member) {
                return (
                  <MemberCard
                    key={member.name}
                    member={member}
                    hideRole={true}
                  />
                );
              }
              return null;
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
