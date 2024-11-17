import { blogs } from "@/lib/blog";
import { BlogCard } from "@/components/home/BlogCard";
import { Button } from "@/components/Button";
import { MemberCard } from "@/components/home/MemberCard";
import { ProjectCard } from "@/components/home/ProjectCard";
import { projects } from "@/lib/projects";
import { HeaderText } from "@/components/headerText";
import {
  getLastMemberPeriod,
  getMembersForPeriod,
} from "@/lib/utils/getRelevantMembers";
import { HeroSection } from "@/components/HeroSection";

export default function Home() {
  return (
    <div>
      <main className="container mx-auto px-4 ">
        <HeroSection />
        <div className="py-8">
          <HeaderText title="Blogg" />
            <div className="py-8 flex flex-col md:flex-row justify-between gap-5">
              {blogs
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, 3)
                .map((blog) => (
                  <BlogCard blog={blog} key={blog.createdAt.toISOString()} />
                ))}
            </div>

          <div className="flex justify-center items-center mt-2">
            <Button title="Les mer" href="/blogg" color={"onlineOrange"} />
          </div>
        </div>
        <div className="pb-8">
          <div className="pb-8">
            <HeaderText title="Våre Prosjekter" id="prosjekter" />
          </div>
          <div className="flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.slice(0, 4).map((project) => (
                <ProjectCard project={project} key={project.title} />
              ))}
            </div>
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 w-full gap-4">
              {getMembersForPeriod(getLastMemberPeriod).map((member) => {
                const rolesByPeriod = member.rolesByPeriod;
                const lastPeriod = Object.keys(rolesByPeriod)
                  .sort()
                  .reverse()[0];

                return (
                  <MemberCard
                    member={member}
                    key={member.name}
                    period={lastPeriod}
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
        </div>
      </main>
    </div>
  );
}
