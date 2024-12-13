import { HeaderText } from "@/components/headerText";
import { ProjectCard } from "@/components/home/ProjectCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany();

  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="py-6 px-6 w-full">
        <main className="flex flex-col gap-5 pb-6">
          <HeaderText title="Appkoms prosjekter" />
          <div className="flex justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 w-full gap-4">
              {projects.map((projects) => (
                <ProjectCard project={projects} key={projects.title} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
