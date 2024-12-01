import { articleType } from "@/lib/types";
import { formatDate } from "@/lib/utils/dateUtils";

import Image from "next/image";
import Link from "next/link";
import { FaClock } from "react-icons/fa";

interface Props {
  blog: articleType;
}

export const BlogCard = ({ blog }: Props) => {
  return (
    <Link href={`blogg/${blog.title}`} className="w-full">
      <div className="border-rounded flex flex-col bg-gray-800 border border-gray-300 rounded-lg group overflow-hidden">
        <div className="relative w-full h-56 overflow-hidden">
          <Image
            src={blog.imageUri}
            alt={blog.title + " illustrasjon"}
            width={1000}
            height={1000}
            className="rounded-t-lg bg-cover w-full h-full object-cover group-hover:scale-125 transition-transform duration-300 ease-in-out"
          />
        </div>
        <div className="p-2 flex flex-col justify-between">
          <h1 className="text-lg font-bold">{blog.title}</h1>
          <div className="flex justify-end items-center mt-2">
            <FaClock size={16} />
            <p>{formatDate(blog.createdAt)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
