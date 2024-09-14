import { MemberCard } from "@/components/home/MemberCard";
import { members } from "@/lib/members";

export default function MembersPage() {
  const orderedMembers = [
    ...members.filter((member) => member.role === "Leder"),
    ...members.filter((member) => member.role === "Nestleder"),
    ...members.filter((member) => member.role === "Økonomiansvarlig"),
    ...members.filter((member) => member.role === "Medlem"),
  ];

  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="py-6 px-6 w-full max-w-screen-lg text-gray-700">
        <main className="flex flex-col gap-5 pb-6">
          <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-semibold">
            Aktive Appkom medlemmer
          </h1>
          <div className="flex justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 w-full gap-4">
              {orderedMembers.map((member) => (
                <MemberCard member={member} key={member.name} />
              ))}
            </div>
          </div>
        </main>
        <main className="flex flex-col gap-5 pb-6">
          <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-semibold">
            Gamle Appkom medlemmer
          </h1>
          {/* <div className="flex justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 w-full gap-4">
              {orderedMembers.map((member) => (
                <MemberCard member={member} key={member.name} />
              ))}
            </div>
          </div> */}
        </main>
      </div>
    </div>
  );
}
