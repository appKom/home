import { projectType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

interface Props {
  project: projectType;
}

export const ProjectCard = ({ project }: Props) => (
  <Link
    href={project.href}
    className="bg-gray-800 rounded-lg group overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
  >
    <div className="overflow-hidden w-full h-48">
      <Image
        src={project.imageUri}
        alt="Online-Opptak"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        width={1000}
        height={1000}
      />
    </div>
    <div className="p-6 flex flex-col justify-between flex-1">
      <div>
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-gray-400 mb-4">{project.shortDescription}</p>
      </div>
      <div className="flex gap-2 items-center border border-white rounded-full w-max px-3 py-[2px] transition-colors duration-300 group-hover:bg-white group-hover:text-gray-800">
        Les mer <FaChevronRight size={14} />
      </div>
    </div>
  </Link>
);