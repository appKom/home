import { Button } from "@/components/Button";
import { MemberCard } from "@/components/home/MemberCard";
import { ProjectCard } from "@/components/home/ProjectCard";
import { HeaderText } from "@/components/headerText";
import { HeroSection } from "@/components/HeroSection";
import { BlogCard } from "@/components/home/BlogCard";
import { roleOrder } from "@/lib/utils/divUtils";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const blogs = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
    take: 3,
  });

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const members = await prisma.member.findMany({
    include: { rolesByPeriod: true },
    where: { isCurrent: true },
  });

  const allMemberPeriods = Array.from(
    new Set(
      members.flatMap(
        (member) => member.rolesByPeriod?.map((r) => r.period) ?? [],
      ),
    ),
  ).reverse();

  const getLastMemberPeriod = allMemberPeriods[0];

  const getMembersForPeriod = (period: string) => {
    return members
      .filter((member) =>
        member.rolesByPeriod?.some((role) => role.period === period),
      )
      .map((member) => {
        const roleForPeriod = member.rolesByPeriod?.find(
          (role) => role.period === period,
        )?.role;
        return { ...member, roleForPeriod };
      })
      .sort(
        (a, b) =>
          (roleOrder[a.roleForPeriod!] ?? 99) -
          (roleOrder[b.roleForPeriod!] ?? 99),
      );
  };

  return (
    <div>
      <main className="container mx-auto px-4 ">
        <HeroSection />
        <section className="pb-16 md:pb-32">
          <HeaderText title="Blogg" />
          {blogs && (
            <div className="grid grid-cols-1 mt-8 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map((blog) => (
                  <BlogCard blog={blog} key={blog.id} />
                ))}
            </div>
          )}
          <div className="flex justify-center items-center mt-4">
            <Button title="Les mer" href="/blogg" color={"onlineOrange"} />
          </div>
        </section>
        <section className="pb-8">
          <div className="pb-8">
            <HeaderText title="Våre Prosjekter" id="prosjekter" />
          </div>
          <div className="flex flex-col">
            {projects && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.slice(0, 4).map((project) => (
                  <ProjectCard project={project} key={project.title} />
                ))}
              </div>
            )}
            <div className="justify-between items-center text-center pt-8">
              <Button
                title={"Se alle prosjekter"}
                href="/prosjekt"
                color={"onlineOrange"}
              />
            </div>
          </div>
        </section>
        <section className="py-8">
          <div className="pb-8">
            <HeaderText title="Medlemmer" />
          </div>
          <div className="flex justify-center">
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
          </div>
          <div className="flex justify-center">
            <Button
              title="Se tidligere medlemmer"
              href="/medlem"
              color={"onlineOrange"}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
