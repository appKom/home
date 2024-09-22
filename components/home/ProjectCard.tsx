import { projectType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface Props {
  project: projectType;
}

export const ProjectCard = ({ project }: Props) => {
  return (
    <Link href={project.href}>
      <div className="flex flex-col group">
        <h1 className="text-xl xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold">
          {project.title}
        </h1>
        <div className="overflow-hidden">
          <div className="relative w-full rounded-lg h-56 overflow-hidden border-white border">
            <Image
              src={project.imageUri}
              alt={project.title + " illustrasjon"}
              width={1000}
              height={1000}
              className="bg-cover w-full rounded-lg h-full object-cover group-hover:scale-125 transition-transform duration-300 ease-in-out"
            />
          </div>
        </div>
        <p className="p-2">{project.shortDescription}</p>
      </div>
    </Link>
  );
};
