import { prisma } from "../prisma";
import { memberType, RoleByPeriodType } from "../types";

const roleOrder = {
  Leder: 1,
  Nestleder: 2,
  Økonomiansvarlig: 3,
  Medlem: 4,
};

const membersFromPrisma = await prisma.member.findMany({
  include: {
    rolesByPeriod: true,
  },
});

const members: memberType[] = membersFromPrisma.map((member) => ({
  ...member,
  rolesByPeriod: member.rolesByPeriod.map((r) => ({
    ...r,
    role: r.role === "Okonomiansvarlig" ? "Økonomiansvarlig" : r.role,
  })) as RoleByPeriodType[],
}));

export const getMember = (memberHref: string) => {
  return members.find((member) => member.href === memberHref);
};

export const getAllMembers = () => {
  return members;
};

export const getMembersForPeriod = (period: string) => {
  return members
    .filter((member) =>
      member.rolesByPeriod?.some((role) => role.period === period)
    )
    .map((member) => {
      const roleForPeriod = member.rolesByPeriod?.find(
        (role) => role.period === period
      )?.role;
      return { ...member, roleForPeriod };
    })
    .sort(
      (a, b) =>
        (roleOrder[a.roleForPeriod!] ?? 99) -
        (roleOrder[b.roleForPeriod!] ?? 99)
    );
};

export const allMemberPeriods = Array.from(
  new Set(
    members.flatMap(
      (member) => member.rolesByPeriod?.map((r) => r.period) ?? []
    )
  )
).reverse();

export const getLastMemberPeriod = allMemberPeriods[0];

export const getNumberOfCurrentMembers = () => {
  return getMembersForPeriod(getLastMemberPeriod).length;
};
