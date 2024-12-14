import { Button } from "@/components/Button";
import { MemberCard } from "@/components/home/MemberCard";
import { ProjectCard } from "@/components/home/ProjectCard";
import { HeaderText } from "@/components/headerText";
import { HeroSection } from "@/components/HeroSection";
import { prisma } from "@/lib/prisma";
import { BlogCard } from "@/components/home/BlogCard";
import { roleOrder } from "@/lib/utils/divUtils";
import { Suspense } from "react";
import { getAllMembers } from "@/lib/memberCache";

export const revalidate = 3600;

export default async function Home() {
  const blogs = await prisma.article.findMany();

  const projects = await prisma.project.findMany({
    include: {
      projectMembers: {
        include: {
          Member: true,
        },
      },
    },
  });

  const members = await getAllMembers();
  if (!members) {
    return <div>No members found.</div>;
  }

  const allMemberPeriods = Array.from(
    new Set(
      members.flatMap(
        (member) => member.rolesByPeriod?.map((r) => r.period) ?? []
      )
    )
  ).reverse();

  const getLastMemberPeriod = allMemberPeriods[0];

  const getMembersForPeriod = (period: string) => {
    return members
      .filter((member) =>
        member.rolesByPeriod?.some((role) => role.period === period)
      )
      .map((member) => {
        const roleForPeriod = member.rolesByPeriod?.find(
          (role) => role.period === period
        )?.role;
        return { ...member, roleForPeriod };
      })
      .sort(
        (a, b) =>
          (roleOrder[a.roleForPeriod!] ?? 99) -
          (roleOrder[b.roleForPeriod!] ?? 99)
      );
  };

  return (
    <div>
      <main className="container mx-auto px-4 ">
        <HeroSection />
        <div className="py-8">
          <HeaderText title="Blogg" />
          <Suspense>
            <div className="py-8 flex flex-col md:flex-row justify-between gap-5">
              {blogs
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, 3)
                .map((blog) => (
                  <BlogCard blog={blog} key={blog.createdAt.toISOString()} />
                ))}
            </div>
          </Suspense>

          <div className="flex justify-center items-center mt-2">
            <Button title="Les mer" href="/blogg" color={"onlineOrange"} />
          </div>
        </div>
        <div className="pb-8">
          <div className="pb-8">
            <HeaderText title="Våre Prosjekter" id="prosjekter" />
          </div>
          <div className="flex flex-col">
            <Suspense>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.slice(0, 4).map((project) => (
                  <ProjectCard project={project} key={project.title} />
                ))}
              </div>
            </Suspense>
            <div className="justify-between items-center text-center pt-8">
              <Button
                title={"Se alle prosjekter"}
                href="/prosjekt"
                color={"onlineOrange"}
              />
            </div>
          </div>
        </div>
        <div className="py-8">
          <div className="pb-8">
            <HeaderText title="Medlemmer" />
          </div>
          <div className="flex justify-center">
            <Suspense>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 w-full gap-4">
                {getMembersForPeriod(getLastMemberPeriod).map((member) => {
                  return (
                    <MemberCard
                      member={member}
                      key={member.name}
                      period={getLastMemberPeriod}
                    />
                  );
                })}
              </div>
            </Suspense>
          </div>
          <div className="flex justify-center">
            <Button
              title="Se tidligere medlemmer"
              href="/medlem"
              color={"onlineOrange"}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
