import AboutPage from "@/components/AboutPage";
import { prisma } from "@/lib/prisma";

export default async function AboutPageWrapper() {
  const numberOfCurrentMembers = await prisma.member.count({
    where: {
      isCurrent: true,
    },
  });
  const numberOfProjects = await prisma.project.count();

  return (
    <div className="min-h-screen text-white">
      <AboutPage
        numberOfCurrentMembers={numberOfCurrentMembers}
        numberOfProjects={numberOfProjects}
      />
    </div>
  );
}
