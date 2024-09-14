import { Metadata } from "next";
import { headers } from "next/headers";
import { members } from "@/lib/members";
import { memberType } from "@/lib/types";
import Custom404 from "@/app/not-found";
import Image from "next/image";
import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/home/ProjectCard";
import { FaCrown } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { FiPhoneIncoming } from "react-icons/fi";
import { MdEmail } from "react-icons/md";

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
  const memberName = decodeURIComponent(encodedProsjektTitle ?? "");

  console.log(encodedProsjektTitle, memberName);

  const member: memberType | undefined = members.find(
    (member) =>
      member.href.toLowerCase() === `/medlem/${memberName.toLowerCase()}`
  );

  if (!member) {
    return <Custom404 />;
  }

  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="py-6 px-6 w-full max-w-screen-lg text-gray-700">
        <main className="flex flex-col gap-5 pb-6">
          <div className="w-full flex justify-center">
            <div className="flex flex-col justify-center items-center">
              {member.role === "Leder" && (
                <div className="">
                  <FaCrown className="text-yellow-500" size={72} />
                </div>
              )}
              <Image
                src={
                  member.imageUri ?? "/medlemmer/default_profile_picture.png"
                }
                alt={`Bilde av: ${member.name}`}
                width={500}
                height={500}
                className="object-cover max-h-96 rounded-full"
              />
            </div>
          </div>
          <article className="flex flex-col gap-5 text-center">
            <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-semibold">
              {member.name}
            </h1>
            <p className="text-2xl">{member.role}</p>
            <div>
              <p>{`Medlem siden: ${member.memberSince}`}</p>
            </div>
            {member.about && (
              <div className="w-full break-words whitespace-pre-wrap px-6 py-12 border-2 border-gray-700 rounded-lg">
                <ReactMarkdown className="w-full" rehypePlugins={[rehypeRaw]}>
                  {member.about}
                </ReactMarkdown>
              </div>
            )}
          </article>

          {(member.email || member.phone) && (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl sm:text-xl md:text-2xl lg:text-4xl font-semibold">
                Kontakt
              </h2>

              {member.phone && (
                <div className="flex flex-row gap-2">
                  <FiPhoneIncoming size={24} />{" "}
                  <p>{`Telefon: ${member.phone}`}</p>{" "}
                </div>
              )}
              {member.email && (
                <div className="flex flex-row gap-2">
                  <MdEmail size={24} /> <p>{`E-Post: ${member.email}`}</p>{" "}
                </div>
              )}
            </div>
          )}

          {member.projects && (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl sm:text-xl md:text-2xl lg:text-4xl font-semibold">
                Prosjekter
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {member.projects.map((project) => {
                  const foundProject = projects.find(
                    (proj) => proj.title === project
                  );
                  return foundProject ? (
                    <ProjectCard
                      key={foundProject.title}
                      project={foundProject}
                    />
                  ) : null;
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
