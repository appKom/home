import { prisma } from "@/lib/prisma";
import { Member, RoleByPeriod } from "@prisma/client";

interface CachedMember {
  data: (Member & { rolesByPeriod: RoleByPeriod[] }) | null;
  fetchedAt: number;
}

interface CachedMemberList {
  data: (Member & { rolesByPeriod: RoleByPeriod[] })[] | null;
  fetchedAt: number;
}

const individualMemberCache = new Map<string, CachedMember>();

const memberListCache = new Map<string, CachedMemberList>();

const CACHE_TTL = 3600 * 1000 * 24; // 24 hours

export const getMemberByHref = async (
  href: string
): Promise<(Member & { rolesByPeriod: RoleByPeriod[] }) | null> => {
  const now = Date.now();
  const cached = individualMemberCache.get(href);

  if (cached && now - cached.fetchedAt < CACHE_TTL) {
    return cached.data;
  }

  const member = await prisma.member.findFirst({
    where: { href: href.toLowerCase() },
    include: { rolesByPeriod: true },
  });

  individualMemberCache.set(href, { data: member, fetchedAt: now });

  return member;
};

export const getAllMembers = async (): Promise<
  (Member & { rolesByPeriod: RoleByPeriod[] })[] | null
> => {
  const now = Date.now();
  const cacheKey = "allMembers";
  const cached = memberListCache.get(cacheKey);

  if (cached && now - cached.fetchedAt < CACHE_TTL) {
    return cached.data ? [...cached.data] : null;
  }

  const members = await prisma.member.findMany({
    include: { rolesByPeriod: true },
  });

  memberListCache.set(cacheKey, { data: members, fetchedAt: now });

  members.forEach((member) => {
    individualMemberCache.set(member.href, { data: member, fetchedAt: now });
  });

  return members;
};

export const clearMemberCache = () => {
  individualMemberCache.clear();
  memberListCache.clear();
};
