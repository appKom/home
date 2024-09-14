import { formatDate } from "@/lib/dateUtils";
import { blogType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { FaClock } from "react-icons/fa";

interface Props {
  blog: blogType;
}

export const BlogCard = ({ blog }: Props) => {
  return (
    <Link href={blog.title}>
      <div className="border-rounded flex flex-col bg-gray-200 rounded-lg">
        <Image
          src={blog.imageUri}
          alt={blog.title + " illustrasjon"}
          width={300}
          height={300}
          className="rounded-t-lg bg-cover"
        />
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
