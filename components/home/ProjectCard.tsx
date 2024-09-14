import { projectType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface Props {
  project: projectType;
}

export const ProjectCard = ({ project }: Props) => {
  return (
    <Link href={project.href}>
      <div className="flex flex-col">
        <h1 className="text-lg font-bold">{project.title}</h1>
        <div className="overflow-hidden rounded-t-lg">
          <div className="hover:scale-110 transition-transform duration-300 ease-in-out">
            <Image
              src={project.imageUri}
              alt={project.title + " illustrasjon"}
              width={1000}
              height={1000}
              className="bg-cover w-full h-56 object-cover"
            />
          </div>
          <p className="p-2">{project.shortDescription}</p>
        </div>
      </div>
    </Link>
  );
};
