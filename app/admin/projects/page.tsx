import BlogTable from "@/components/admin/BlogTable";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { Button } from "@/components/Button";
import ProjectTable from "@/components/admin/ProjectTable";
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany();
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center py-8 ">
      <main className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 pt-10 pb-24 lg:pt-16">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Hva ønsker {session?.user!.name} å gjøre?
          </h1>
        </div>
        <div className="flex justify-center">
          <Button
            title={"Opprett blogg"}
            href="/admin/blogg/create"
            color={"onlineOrange"}
          />
        </div>
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-3xl font-bold text-gray-100">Blogger</h1>
          <ProjectTable projects={projects} />
        </div>
      </main>
    </div>
  );
}
