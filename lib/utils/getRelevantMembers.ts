import { prisma } from "../prisma";
import { memberType, RolesByPeriod } from "../types";

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
  rolesByPeriod: member.rolesByPeriod.reduce<RolesByPeriod>((acc, role) => {
    acc[role.period] = role.role;
    return acc;
  }, {}),
}));

export const getMember = (memberHref: string) => {
  return members.find((member) => member.href === memberHref);
};

export const getAllMembers = () => {
  return members;
};

export const getMembersForPeriod = (period: string) => {
  return members
    .filter((member) => member.rolesByPeriod.hasOwnProperty(period))
    .map((member) => {
      const roleForPeriod = member.rolesByPeriod[period];
      return { ...member, roleForPeriod };
    })
    .sort((a, b) => roleOrder[a.roleForPeriod] - roleOrder[b.roleForPeriod]);
};

export const allMemberPeriods = Array.from(
  new Set(members.flatMap((member) => Object.keys(member.rolesByPeriod)))
).reverse();

export const getLastMemberPeriod = Array.from(
  new Set(members.flatMap((member) => Object.keys(member.rolesByPeriod)))
).reverse()[0];

export const getNumberOfCurrentMembers = () => {
  return getMembersForPeriod(getLastMemberPeriod).length;
};
