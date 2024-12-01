"use client";

import { members } from "@/lib/members";
import { articleType } from "@/lib/types";
import { useState } from "react";
import toast from "react-hot-toast";

interface BlogTableProps {
  blogs: articleType[];
}

const BlogTable = ({ blogs }: BlogTableProps) => {
  const [blogList, setBlogList] = useState(blogs);

  const deleteBlog = async (id: number) => {
    const confirmed = confirm(
      "Er du sikker på at du vil slette denne bloggen?"
    );
    if (!confirmed) return;

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
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Tittel
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Forfatter
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {blogList.map((blog, index) => (
            <tr
              key={blog.id}
              className={`${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-gray-900"
                  : "bg-white dark:bg-gray-800"
              } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {blog.title}
                </h2>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {members.find((member) => member.id === blog.authorId)?.name ||
                  "Unknown Author"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => deleteBlog(blog.id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 transition-colors duration-200"
                >
                  Slett
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogTable;
