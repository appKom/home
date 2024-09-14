import { Metadata } from "next";
import { headers } from "next/headers";
import { projects } from "@/lib/projects";
import { projectType } from "@/lib/types";
import Custom404 from "@/app/not-found";
import Image from "next/image";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

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

          <article className="w-full break-words whitespace-pre-wrap px-6 py-12">
            <ReactMarkdown className="w-full" rehypePlugins={[rehypeRaw]}>
              {project.description}
            </ReactMarkdown>
          </article>
        </main>
      </div>
    </div>
  );
}
