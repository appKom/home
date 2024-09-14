import { memberType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { BiDollar } from "react-icons/bi";
import { FaCrown } from "react-icons/fa";

interface Props {
  member: memberType;
  hideRole?: boolean;
}

export const MemberCard = ({ member, hideRole }: Props) => {
  return (
    <Link href={member.href} className="p-8 w-full">
      <div className="relative flex flex-col items-center hover:scale-110 transition-transform duration-300 ease-in-out text-center">
        {!hideRole && (
          <>
            {member.role === "Leder" && (
              <div className="absolute -top-12">
                <FaCrown className="text-yellow-500" size={48} />
              </div>
            )}
            {member.role === "Nestleder" && (
              <div className="absolute -top-8">
                <FaCrown className="text-gray-500" size={32} />
              </div>
            )}
            {member.role === "Økonomiansvarlig" && (
              <div className="absolute -top-8">
                <BiDollar className="text-gray-500" size={32} />
              </div>
            )}
          </>
        )}

        <Image
          src={member.imageUri ?? "/medlemmer/default_profile_picture.png"}
          alt={`Bilde av: ${member.name}`}
          height={100}
          width={100}
          className="rounded-full aspect-square object-cover"
        />
        <p className="mt-4">{member.name}</p>
        {!hideRole && <p className="text-sm text-gray-500">{member.role}</p>}
      </div>
    </Link>
  );
};
