"use client";

import { members } from "@/lib/members";
import { articleType } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

interface BlogTableProps {
  blogs: articleType[];
}

const BlogTable = ({ blogs }: BlogTableProps) => {
  const [blogList, setBlogList] = useState(blogs);
  const [isLoading, setIsLoading] = useState(false);

  const deleteBlog = async (id: number) => {
    const confirmed = confirm(
      "Er du sikker på at du vil slette denne bloggen?"
    );
    if (!confirmed) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/article/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Bloggen ble slettet.");
        setBlogList(blogList.filter((blog) => blog.id !== id));
      } else {
        toast.error("Failed to delete the blog.");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("An error occurred while deleting the blog.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className=" text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-y-2  mb-4"></div>
          <h2 className="text-2xl font-semibold">Sletter blogg...</h2>
          <p className="text-slate-400 mt-2">
            {`Vennligst vent mens bloggen blir slettet :)`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blogList.map((blog) => (
          <Link
            href={`/admin/blogg/edit/${blog.id}`}
            key={blog.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <Image
              src={blog.imageUri}
              alt={blog.imageDescription}
              width={300}
              height={300}
              className="w-full h-40 object-cover"
            />

            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">
              {blog.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {members.find((member) => member.id === blog.authorId)?.name ||
                "Unknown Author"}
            </p>

            <div className="flex justify-end space-x-2 p-4 bg-gray-50 dark:bg-gray-700">
              <button
                onClick={(event) => {
                  event.preventDefault();
                  deleteBlog(blog.id);
                }}
                className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition-colors duration-200"
              >
                Slett
              </button>
              <Link
                href={`/admin/blogg/edit/${blog.id}`}
                className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-200"
              >
                Rediger
              </Link>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogTable;
