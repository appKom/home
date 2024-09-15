import { ProjectCard } from "@/components/home/ProjectCard";
import { projects } from "@/lib/projects";

export default function ProjectsPage() {
  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="py-6 px-6 w-full  text-gray-700">
        <main className="flex flex-col gap-5 pb-6">
          <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-semibold">
            Appkoms prosjekter
          </h1>
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
