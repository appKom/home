import { memberType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { BiDollar } from "react-icons/bi";
import { FaCrown, FaHatWizard } from "react-icons/fa";

interface Props {
  member: memberType;
  period: string;
  hideRole?: boolean;
  isProjectLead?: boolean;
}

export const MemberCard = ({
  member,
  period,
  hideRole,
  isProjectLead,
}: Props) => {
  const roleForPeriod = member.rolesByPeriod?.find(
    (r) => r.period === period,
  )?.role;

  return (
    <Link href={"/medlem/" + member.href} className="p-8 w-full text-gray-300">
      <div className="relative flex flex-col items-center hover:scale-110 transition-transform duration-300 ease-in-out text-center">
        {!hideRole && roleForPeriod && (
          <>
            {roleForPeriod === "Leder" && (
              <div className="absolute -top-12">
                <FaCrown className="text-yellow-500" size={48} />
              </div>
            )}
            {roleForPeriod === "Nestleder" && (
              <div className="absolute -top-8">
                <FaCrown className="text-gray-500" size={32} />
              </div>
            )}
            {roleForPeriod === "Okonomiansvarlig" && (
              <div className="absolute -top-8">
                <BiDollar className="text-gray-500" size={32} />
              </div>
            )}
          </>
        )}
        {isProjectLead && (
          <div className="absolute -top-8">
            <FaHatWizard className="text-purple-600" size={32} />
          </div>
        )}

        <Image
          src={member.imageUri ?? "/medlemmer/default_profile_picture.png"}
          alt={`Bilde av: ${member.name}`}
          height={100}
          width={100}
          className="rounded-full aspect-square object-cover"
        />
        <p className="mt-4">{member.name}</p>
        <p className="text-sm text-gray-500">
          {!hideRole
            ? roleForPeriod === "Okonomiansvarlig"
              ? "Økonomiansvarlig"
              : roleForPeriod
            : isProjectLead
              ? "Prosjektleder"
              : "Bidragsyter"}
        </p>
      </div>
    </Link>
  );
};
