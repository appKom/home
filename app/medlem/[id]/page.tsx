import { Metadata } from "next";
import { headers } from "next/headers";
import { members } from "@/lib/members";
import { memberType } from "@/lib/types";
import Custom404 from "@/app/not-found";
import Image from "next/image";
import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/home/ProjectCard";
import { FaCrown, FaGithub, FaLinkedin } from "react-icons/fa";
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

export default async function MemberPage({ params }: Params) {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto");

  const url = new URL(`${protocol}://${host}/prosjekt/${params.id}`);
  const { pathname } = url;

  const parts = pathname.split("/");
  const encodedProsjektTitle = parts[parts.length - 1] || "";
  const memberName = decodeURIComponent(encodedProsjektTitle ?? "");

  const member: memberType | undefined = members.find(
    (member) =>
      member.href.toLowerCase() === `/medlem/${memberName.toLowerCase()}`
  );

  if (!member) {
    return <Custom404 />;
  }

  const periods = Object.keys(member.rolesByPeriod).sort();
  const latestPeriod = periods[periods.length - 1];
  const earliestPeriod = periods[0].split("-")[0];
  const latestRole = member.rolesByPeriod[latestPeriod];

  const projectsWithMember = projects.filter((project) =>
    project.people.some((person) => person.name === member.href)
  );

  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="py-6 px-6 w-full text-gray-700">
        <main className="flex flex-col gap-5 pb-6">
          <div className="w-full flex justify-center">
            <div className="flex flex-col justify-center items-center">
              {latestRole === "Leder" && (
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
            <p className="text-2xl">{latestRole}</p>
            <div>
              <p>{`Medlem siden: ${earliestPeriod}`}</p>
            </div>
            {member.about && (
              <div className="w-full break-words whitespace-pre-wrap px-6 py-12 border-2 border-gray-700 rounded-lg">
                <ReactMarkdown className="w-full" rehypePlugins={[rehypeRaw]}>
                  {member.about}
                </ReactMarkdown>
              </div>
            )}
          </article>
          <div className="flex flex-wrap justify-center gap-3">
            {periods
              .filter((period) => member.rolesByPeriod[period] !== "Medlem")
              .map((period) => {
                const role = member.rolesByPeriod[period];
                const roleColor =
                  role === "Leder"
                    ? "bg-yellow-500 text-white"
                    : role === "Nestleder"
                    ? "bg-gray-500 text-white"
                    : role === "Økonomiansvarlig"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700";

                return (
                  <span
                    key={period}
                    className={`px-3 py-1 ${roleColor} rounded-full text-sm`}
                  >
                    {`${role} ${period}`}
                  </span>
                );
              })}
          </div>

          {(member.email ||
            member.phone ||
            member.github ||
            member.linkedin) && (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl sm:text-xl md:text-2xl lg:text-4xl font-semibold">
                Kontakt
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                {member.phone && (
                  <div className="flex flex-row gap-2 hover:text-onlineOrange">
                    <FiPhoneIncoming size={24} />
                    <a href={`tel:+47${member.phone}`}>{`${member.phone}`}</a>
                  </div>
                )}
                {member.email && (
                  <div className="flex flex-row gap-2 hover:text-onlineOrange">
                    <MdEmail size={24} />
                    <a href={`mailto:${member.email}`}>{`${member.email}`}</a>
                  </div>
                )}
                {member.github && (
                  <div className="flex flex-row gap-2">
                    <a
                      className="flex flex-row gap-2 hover:text-onlineOrange"
                      href={member.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaGithub size={24} />
                      <p>{member.github.split("https://www.")}</p>
                    </a>
                  </div>
                )}
                {member.linkedin && (
                  <div className="flex flex-row gap-2">
                    <a
                      className="flex flex-row gap-2 hover:text-onlineOrange"
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaLinkedin size={24} />
                      <p>{member.linkedin.split("https://www.")}</p>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-5">
            <h2 className="text-xl sm:text-xl md:text-2xl lg:text-4xl font-semibold">
              Prosjekter
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projectsWithMember.map((project) => (
                <ProjectCard project={project} key={project.title} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
