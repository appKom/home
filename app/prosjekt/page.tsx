import { HeaderText } from "@/components/headerText";
import { ProjectCard } from "@/components/home/ProjectCard";
import { getAllProjects } from "@/lib/projectCache";
import { Suspense } from "react";

export const revalidate = 36000;

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  if (!projects) {
    return <div>No projects found.</div>;
  }

  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="py-6 px-6 w-full">
        <main className="flex flex-col gap-5 pb-6">
          <HeaderText title="Appkoms prosjekter" />
          <div className="flex justify-center">
            <Suspense>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 w-full gap-4">
                {projects.map((projects) => (
                  <ProjectCard project={projects} key={projects.title} />
                ))}
              </div>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
