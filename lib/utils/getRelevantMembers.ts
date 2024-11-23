import { members } from "@/lib/members";

const roleOrder = {
  Leder: 1,
  Nestleder: 2,
  Økonomiansvarlig: 3,
  Medlem: 4,
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
}