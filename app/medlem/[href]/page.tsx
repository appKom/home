import { Metadata } from "next";
import { hrefParams } from "@/lib/types";
import Custom404 from "@/app/not-found";
import Image from "next/image";
import { ProjectCard } from "@/components/home/ProjectCard";
import { FaCrown, FaGithub, FaLinkedin, FaPhone } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { MdEmail } from "react-icons/md";
import { Member } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(props: {
  params: hrefParams;
}): Promise<Metadata> {
  const { href } = await props.params;
  const decodedHref = decodeURIComponent(href);

  const member = await prisma.member.findUnique({
    where: { href: decodedHref },
    include: { rolesByPeriod: true },
  });

  if (!member) {
    return {
      title: "Medlem ikke funnet",
    };
  }

  const latestRole =
    member.rolesByPeriod && member.rolesByPeriod.length > 0
      ? member.rolesByPeriod[member.rolesByPeriod.length - 1].role
      : "Medlem";

  const description = member.about
    ? member.about.replace(/[#*`]/g, "").slice(0, 160).trim()
    : member.quote
      ? `"${member.quote}" - ${member.name}, ${latestRole} i Appkom`
      : `${member.name} - ${latestRole} i Appkom`;

  const periods = member.rolesByPeriod
    ? member.rolesByPeriod.map((r) => r.period).sort()
    : [];
  const earliestPeriod = periods.length > 0 ? periods[0].split("-")[0] : "";
  const latestPeriod = periods.length > 0 ? periods[periods.length - 1] : "";
  const membershipPeriod = member.isCurrent
    ? `Medlem fra ${earliestPeriod}`
    : `Medlem ${earliestPeriod}-${latestPeriod.split("-")[1]}`;

  return {
    title: `${member.name} | ${latestRole} | Appkom`,
    description: description,
    openGraph: {
      title: `${member.name} | ${latestRole} | Appkom`,
      description: description,
      type: "profile",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/medlem/${member.href}`,
      images: [
        {
          url: member.imageUri ?? "/medlemmer/default_profile_picture.png",
          width: 500,
          height: 500,
          alt: `Profilbilde av ${member.name}`,
        },
      ],
      siteName: "Appkom",
      locale: "no_NO",
      firstName: member.name.split(" ")[0],
      lastName: member.name.split(" ").slice(1).join(" "),
      username: member.href,
    },
    twitter: {
      card: "summary",
      title: `${member.name} | ${latestRole} | Appkom`,
      description: description,
      images: [member.imageUri ?? "/medlemmer/default_profile_picture.png"],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/medlem/${member.href}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    authors: [{ name: member.name }],
    keywords: [
      "Appkom",
      member.name,
      latestRole,
      "NTNU",
      "Medlem",
      "Studentorganisasjon",
      "Linjeforening",
      "Informatikk",
    ],
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://appkom.no",
    ),
    other: {
      "og:profile:role": latestRole,
      "og:profile:membership": membershipPeriod,
    },
  };
}

export async function generateStaticParams() {
  const members = await prisma.member.findMany({
    select: { href: true },
  });

  return members.map((member) => ({
    href: member.href,
  }));
}

export default async function MemberPage(props: { params: hrefParams }) {
  const { href } = await props.params;

  const member = await prisma.member.findUnique({
    where: { href: decodeURIComponent(href) },
    include: { rolesByPeriod: true },
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
      <div className="flex flex-col items-center space-y-8 md:flex-row md:items-start md:space-x-12 md:space-y-0">
        <div className="relative flex-shrink-0">
          {latestRole === "Leder" && (
            <FaCrown
              className="absolute -top-6 right-3 rotate-[30deg] text-yellow-500"
              size={48}
            />
          )}
          <Image
            src={member.imageUri ?? "/medlemmer/default_profile_picture.png"}
            alt={member.name}
            width={500}
            height={500}
            className="h-48 w-48 rounded-full border-4 border-gray-700 object-cover shadow-lg"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="mb-2 text-3xl font-bold">{member.name}</h1>
          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            {periods
              .filter((period) => {
                const roleObj = member.rolesByPeriod?.find(
                  (r) => r.period === period,
                );
                return roleObj?.role !== "Medlem";
              })
              .map((period) => {
                const roleObj = member.rolesByPeriod?.find(
                  (r) => r.period === period,
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
          <p className="my-2 text-gray-400">
            Medlem fra {earliestPeriod}{" "}
            {!member.isCurrent && "-" + latestPeriod.split("-")[1]}
          </p>

          {/* Contact Info */}
          <div className="mt-4 flex justify-center gap-4 text-gray-500 md:justify-start">
            {member.github && (
              <Tooltip title={member.github}>
                <a
                  href={member.github}
                  className="transition-colors hover:text-white"
                >
                  <FaGithub size={24} />
                </a>
              </Tooltip>
            )}

            {member.linkedin && (
              <Tooltip title={member.linkedin}>
                <a
                  href={member.linkedin}
                  className="transition-colors hover:text-blue-600"
                >
                  <FaLinkedin size={24} />
                </a>
              </Tooltip>
            )}

            {member.email && (
              <Tooltip title={member.email}>
                <a
                  href={`mailto:${member.email}`}
                  className="transition-colors hover:text-red-500"
                >
                  <MdEmail size={24} />
                </a>
              </Tooltip>
            )}

            {member.phone && (
              <Tooltip title={member.phone}>
                <a
                  href={`tel:+47${member.phone}`}
                  className="transition-colors hover:text-green-500"
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
          className="mt-8 w-full whitespace-pre-wrap break-words rounded-lg bg-gray-800 px-6 py-4"
          rehypePlugins={[rehypeRaw]}
        >
          {member.about}
        </ReactMarkdown>
      )}
      {projectsWithMember && projectsWithMember.length > 0 && (
        <>
          <h2 className="mb-8 mt-16 text-2xl font-bold">Prosjekter</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {projectsWithMember.map((project) => (
              <ProjectCard project={project} key={project.title} />
            ))}
          </div>
        </>
      )}
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
    <div className="group relative flex items-center">
      {children}
      <div className="absolute left-1/2 top-4 z-10 mt-2 hidden w-max -translate-x-1/2 transform rounded bg-gray-800 p-2 text-sm text-white shadow-lg transition-opacity duration-200 group-hover:block">
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
  <figure className="mx-auto mt-8 max-w-screen-md text-center md:mt-0">
    <svg
      className="mx-auto mb-3 h-10 w-10 text-gray-600"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 18 14"
    >
      <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
    </svg>
    <blockquote>
      <ReactMarkdown
        className="whitespace-pre-wrap break-words text-2xl font-medium italic text-white"
        rehypePlugins={[rehypeRaw]}
      >
        {'"' + member.quote + '"'}
      </ReactMarkdown>
    </blockquote>
    <figcaption className="mt-6 flex items-center justify-center divide-x-2 divide-gray-700 rtl:divide-x-reverse">
      <cite className="pe-3 font-medium text-white">{member.name}</cite>
      <cite className="ps-3 text-sm text-gray-400">{latestRole} i Appkom</cite>
    </figcaption>
  </figure>
);
