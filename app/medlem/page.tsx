import { MemberCard } from "@/components/home/MemberCard";
import { members } from "@/lib/members";

export default function MembersPage() {
  const allMemberPeriods = Array.from(
    new Set(members.flatMap((member) => Object.keys(member.rolesByPeriod)))
  ).reverse();

  const roleOrder = {
    Leder: 1,
    Nestleder: 2,
    Økonomiansvarlig: 3,
    Medlem: 4,
  };

  const getMembersForPeriod = (period: string) => {
    return members
      .filter((member) => member.rolesByPeriod.hasOwnProperty(period))
      .map((member) => {
        const roleForPeriod = member.rolesByPeriod[period];
        return { ...member, roleForPeriod };
      })
      .sort((a, b) => roleOrder[a.roleForPeriod] - roleOrder[b.roleForPeriod]);
  };

  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="py-6 px-6 w-full">
        <main className="flex flex-col gap-5 pb-6">
          <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-semibold">
            Appkoms Medlemmer
          </h1>
          {allMemberPeriods.map((period) => (
            <div key={period}>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold pb-8">
                {period}
              </h2>
              <div className="flex justify-center">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 w-full gap-4">
                  {getMembersForPeriod(period).map((member) => (
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
