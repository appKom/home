import { Metadata } from "next";
import { tParams } from "@/lib/types";
import Custom404 from "@/app/not-found";
import Image from "next/image";
import { ProjectCard } from "@/components/home/ProjectCard";
import { FaCrown, FaGithub, FaLinkedin, FaPhone } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { MdEmail } from "react-icons/md";
import { prisma } from "@/lib/prisma";
import { Member } from "@prisma/client";

export const revalidate = 36000;

export async function generateMetadata(props: {
  params: tParams;
}): Promise<Metadata> {
  const { id } = props.params;

  const member = await prisma.member.findFirst({
    where: { href: id },
    select: { name: true },
  });

  const title = member ? member.name : "Member Not Found";
  return {
    title: title,
  };
}

export default async function MemberPage(props: { params: tParams }) {
  const { id } = props.params;

  const member = await prisma.member.findFirst({
    where: {
      href: id,
    },
    include: {
      rolesByPeriod: true,
    },
  });

  if (!member || !member.rolesByPeriod) {
    return <Custom404 />;
  }
  const periods = member.rolesByPeriod.map((r) => r.period).sort();

  const latestPeriod = periods[periods.length - 1];
  const earliestPeriod = periods[0].split("-")[0];

  const latestRole = member.rolesByPeriod[member.rolesByPeriod.length - 1].role;

  const projectsWithMember = await prisma.project.findMany({
    where: {
      projectMembers: {
        some: {
          memberId: member.id,
        },
      },
    },
  });

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
        <div className="relative flex-shrink-0">
          {latestRole === "Leder" && (
            <FaCrown
              className="text-yellow-500 absolute right-3 -top-6 rotate-[30deg]"
              size={48}
            />
          )}
          <Image
            src={member.imageUri ?? "/medlemmer/default_profile_picture.png"}
            alt={member.name}
            width={500}
            height={500}
            className="w-48 h-48 rounded-full object-cover border-4 border-gray-700 shadow-lg"
          />
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold mb-2">{member.name}</h1>
          <div className="flex gap-2 flex-wrap justify-center md:justify-start">
            {periods
              .filter((period) => {
                const roleObj = member.rolesByPeriod?.find(
                  (r) => r.period === period
                );
                return roleObj?.role !== "Medlem";
              })
              .map((period) => {
                const roleObj = member.rolesByPeriod?.find(
                  (r) => r.period === period
                );
                const role = roleObj?.role ?? "Unknown Role";

                const roleColor =
                  role === "Leder"
                    ? "text-yellow-500"
                    : role === "Nestleder"
                    ? "text-purple-500"
                    : role === "Okonomiansvarlig"
                    ? "text-green-500"
                    : "text-gray-200";
                return (
                  <span
                    key={period}
                    className={`bg-gray-800 px-3 py-1 ${roleColor} rounded-full text-sm`}
                  >
                    {role} {period}
                  </span>
                );
              })}
          </div>
          <p className="text-gray-400 my-2">
            Medlem fra {earliestPeriod}{" "}
            {!member.isCurrent && "-" + latestPeriod.split("-")[1]}
          </p>

          {/* Contact Info */}
          <div className="flex justify-center md:justify-start gap-4 mt-4 text-gray-500 ">
            {member.github && (
              <Tooltip title={member.github}>
                <a
                  href={member.github}
                  className="hover:text-white transition-colors"
                >
                  <FaGithub size={24} />
                </a>
              </Tooltip>
            )}

            {member.linkedin && (
              <Tooltip title={member.linkedin}>
                <a
                  href={member.linkedin}
                  className="hover:text-blue-600 transition-colors"
                >
                  <FaLinkedin size={24} />
                </a>
              </Tooltip>
            )}

            {member.email && (
              <Tooltip title={member.email}>
                <a
                  href={`mailto:${member.email}`}
                  className="hover:text-red-500 transition-colors"
                >
                  <MdEmail size={24} />
                </a>
              </Tooltip>
            )}

            {member.phone && (
              <Tooltip title={member.phone}>
                <a
                  href={`tel:+47${member.phone}`}
                  className="hover:text-green-500 transition-colors"
                >
                  <FaPhone size={20} />
                </a>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      {member.quote && <Quote member={member} latestRole={latestRole} />}

      {member.about && (
        <ReactMarkdown
          className="w-full break-words whitespace-pre-wrap px-6 mt-8 py-4 bg-gray-800 rounded-lg"
          rehypePlugins={[rehypeRaw]}
        >
          {member.about}
        </ReactMarkdown>
      )}

      {projectsWithMember.length > 0 && (
        <h2 className="text-2xl font-bold mt-16 mb-8">Prosjekter</h2>
      )}
      <div className="grid md:grid-cols-2 gap-8">
        {projectsWithMember.map((project) => (
          <ProjectCard project={project} key={project.title} />
        ))}
      </div>
    </main>
  );
}

const Tooltip = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative flex items-center group">
      {children}
      <div className="z-10 hidden absolute left-1/2 transform top-4 -translate-x-1/2 mt-2 w-max p-2 bg-gray-800 text-white text-sm rounded shadow-lg group-hover:block transition-opacity duration-200">
        {title}
      </div>
    </div>
  );
};

const Quote = ({
  member,
  latestRole,
}: {
  member: Member;
  latestRole: string;
}) => (
  <figure className="max-w-screen-md mx-auto text-center mt-8 md:mt-0">
    <svg
      className="w-10 h-10 mx-auto mb-3 text-gray-600"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 18 14"
    >
      <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
    </svg>
    <blockquote>
      <ReactMarkdown
        className="text-2xl break-words whitespace-pre-wrap italic font-medium text-white"
        rehypePlugins={[rehypeRaw]}
      >
        {'"' + member.quote + '"'}
      </ReactMarkdown>
    </blockquote>
    <figcaption className="flex items-center justify-center divide-x-2 mt-6 rtl:divide-x-reverse divide-gray-700">
      <cite className="pe-3 font-medium text-white">{member.name}</cite>
      <cite className="ps-3 text-sm text-gray-400">{latestRole} i Appkom</cite>
    </figcaption>
  </figure>
);
