import { HeaderText } from "@/components/headerText";
import { MemberCard } from "@/components/home/MemberCard";
import { prisma } from "@/lib/prisma";
import { roleOrder } from "@/lib/utils/divUtils";

export const revalidate = 36000;

export default async function MembersPage() {
  const members = await prisma.member.findMany({
    include: {
      rolesByPeriod: true,
    },
  });

  const uniquePeriods = Array.from(
    new Set(
      members.flatMap(
        (member) => member.rolesByPeriod?.map((r) => r.period) ?? []
      )
    )
  );

  const allMemberPeriods = uniquePeriods.sort((a, b) => {
    const aStart = parseInt(a.split("-")[0], 10);
    const bStart = parseInt(b.split("-")[0], 10);
    return bStart - aStart;
  });

  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="py-6 px-6 w-full">
        <main className="flex flex-col gap-5 pb-6">
          <HeaderText title="Appkoms medlemmer" />
          {allMemberPeriods.map((period) => {
            const membersInPeriod = members.filter((member) =>
              member.rolesByPeriod?.some((r) => r.period === period)
            );

            const sortedMembers = membersInPeriod.sort((a, b) => {
              const aRoleObj = a.rolesByPeriod.find((r) => r.period === period);
              const bRoleObj = b.rolesByPeriod.find((r) => r.period === period);

              const aRole = aRoleObj ? aRoleObj.role : undefined;
              const bRole = bRoleObj ? bRoleObj.role : undefined;

              const aRoleOrder = aRole ? roleOrder[aRole] ?? 99 : 99;
              const bRoleOrder = bRole ? roleOrder[bRole] ?? 99 : 99;

              if (aRoleOrder !== bRoleOrder) {
                return aRoleOrder - bRoleOrder;
              }

              return a.name.localeCompare(b.name);
            });

            return (
              <div key={period}>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold pb-8">
                  {period}
                </h2>
                <div className="flex justify-center">
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 w-full gap-4">
                    {sortedMembers.map((member) => (
                      <MemberCard
                        member={member}
                        key={member.id}
                        period={period}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}
