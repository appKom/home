import { HeaderText } from "@/components/headerText";
import { ProjectCard } from "@/components/home/ProjectCard";
import { projects } from "@/lib/projects";

export default function ProjectsPage() {
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
