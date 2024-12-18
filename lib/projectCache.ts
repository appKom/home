import { prisma } from "@/lib/prisma";
import { Project, ProjectMember, Member } from "@prisma/client";

interface CachedProject {
  data:
    | (Project & { projectMembers: (ProjectMember & { Member: Member })[] })
    | null;
  fetchedAt: number;
}

interface CachedProjectList {
  data:
    | (Project & { projectMembers: (ProjectMember & { Member: Member })[] })[]
    | null;
  fetchedAt: number;
}

const individualProjectCache = new Map<string, CachedProject>();
const projectListCache = new Map<string, CachedProjectList>();
const projectsByMemberCache = new Map<number, CachedProjectList>();

const CACHE_TTL = 3600 * 1000 * 24;

export const getProjectByHref = async (
  href: string
): Promise<
  (Project & { projectMembers: (ProjectMember & { Member: Member })[] }) | null
> => {
  const now = Date.now();
  const cached = individualProjectCache.get(href);

  if (cached && now - cached.fetchedAt < CACHE_TTL) {
    return cached.data;
  }

  const project = await prisma.project.findFirst({
    where: { href: href.toLowerCase() },
    include: { projectMembers: { include: { Member: true } } },
  });

  individualProjectCache.set(href, { data: project, fetchedAt: now });

  return project;
};

export const getProjectsByMember = async (
  memberId: number
): Promise<
  | (Project & { projectMembers: (ProjectMember & { Member: Member })[] })[]
  | null
> => {
  const now = Date.now();
  const cached = projectsByMemberCache.get(memberId);

  if (cached && now - cached.fetchedAt < CACHE_TTL) {
    return cached.data ? [...cached.data] : null;
  }

  const projects = await prisma.project.findMany({
    where: {
      projectMembers: {
        some: {
          memberId: memberId,
        },
      },
    },
    include: {
      projectMembers: {
        include: {
          Member: true,
        },
      },
    },
  });

  projectsByMemberCache.set(memberId, { data: projects, fetchedAt: now });

  projects.forEach((project) => {
    individualProjectCache.set(project.href, { data: project, fetchedAt: now });
  });

  return projects;
};

export const getAllProjects = async (): Promise<
  | (Project & { projectMembers: (ProjectMember & { Member: Member })[] })[]
  | null
> => {
  const now = Date.now();
  const cacheKey = "allProjects";
  const cached = projectListCache.get(cacheKey);

  if (cached && now - cached.fetchedAt < CACHE_TTL) {
    return cached.data ? [...cached.data] : null;
  }

  const projects = await prisma.project.findMany({
    include: { projectMembers: { include: { Member: true } } },
  });

  projectListCache.set(cacheKey, { data: projects, fetchedAt: now });

  projects.forEach((project) => {
    individualProjectCache.set(project.href, { data: project, fetchedAt: now });
  });

  return projects;
};

export const clearProjectCache = () => {
  individualProjectCache.clear();
  projectListCache.clear();
};
