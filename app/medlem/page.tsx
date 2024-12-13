import { HeaderText } from "@/components/headerText";
import { MemberCard } from "@/components/home/MemberCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 36000;

export default async function MembersPage() {
  const members = await prisma.member.findMany({
    include: {
      rolesByPeriod: true,
    },
  });

  const allMemberPeriods = Array.from(
    new Set(
      members.flatMap(
        (member) => member.rolesByPeriod?.map((r) => r.period) ?? []
      )
    )
  ).reverse();

  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="py-6 px-6 w-full">
        <main className="flex flex-col gap-5 pb-6">
          <HeaderText title="Appkoms medlemmer" />
          {allMemberPeriods.map((period) => (
            <div key={period}>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold pb-8">
                {period}
              </h2>
              <div className="flex justify-center">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 w-full gap-4">
                  {members.map((member) => (
                    <MemberCard
                      member={member}
                      key={member.name}
                      period={period}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
