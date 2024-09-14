import { Metadata } from "next";
import { headers } from "next/headers";
import { members } from "@/lib/members";
import { memberType } from "@/lib/types";
import Custom404 from "@/app/not-found";
import Image from "next/image";

interface Params {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto");

  if (!host || !protocol) {
    return {
      title: "Error",
    };
  }

  const url = new URL(`${protocol}://${host}/artikkel/${params.id}`);
  const { pathname } = url;

  const parts = pathname.split("-");
  const title = decodeURIComponent(parts.slice(1).join("-"));

  return {
    title: `${title}`,
  };
}

export default async function ProjectPage({ params }: Params) {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto");

  const url = new URL(`${protocol}://${host}/prosjekt/${params.id}`);
  const { pathname } = url;

  const parts = pathname.split("/");
  const encodedProsjektTitle = parts[parts.length - 1] || "";
  const memberName = decodeURIComponent(encodedProsjektTitle ?? "");

  console.log(encodedProsjektTitle, memberName);

  const member: memberType | undefined = members.find(
    (member) =>
      member.href.toLowerCase() === `/medlem/${memberName.toLowerCase()}`
  );

  if (!member) {
    return <Custom404 />;
  }

  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="py-6 px-6 w-full max-w-screen-lg text-gray-700">
        <main className="flex flex-col gap-5 pb-6">
          <div className="w-full flex justify-center">
            <Image
              src={member.imageUri ?? "/medlemmer/default_profile_picture.png"}
              alt={`Bilde av: ${member.name}`}
              width={500}
              height={500}
              className="object-cover max-h-96 rounded-full"
            />
          </div>
          <article className="flex flex-col gap-5 text-center">
            <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-semibold">
              {member.name}
            </h1>
            <p>{member.role}</p>
          </article>
        </main>
      </div>
    </div>
  );
}
