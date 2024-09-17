import { BlogCard } from "@/components/home/BlogCard";
import { blogs } from "@/lib/blog";
import { getMonthNameInNorwegian } from "@/lib/dateUtils";
import { blogType } from "@/lib/types";
import { useMemo } from "react";

export default function BlogsPage() {
  const blogsByMonth = useMemo(() => {
    const groupedBlogs = blogs.reduce<Record<string, blogType[]>>(
      (acc, blog) => {
        const monthYear = `${getMonthNameInNorwegian(
          blog.createdAt
        )} ${blog.createdAt.getFullYear()}`;
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(blog);
        return acc;
      },
      {}
    );
    return groupedBlogs;
  }, [blogs]);

  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="py-6 px-6 w-full">
        <main className="flex flex-col gap-5">
          <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-semibold">
            Blogger
          </h1>

          <div className="flex flex-col gap-5">
            {Object.keys(blogsByMonth).map((monthYear) => (
              <div key={monthYear}>
                <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl font-semibold">
                  {monthYear}
                </h2>
                <div className="flex flex-col gap-5">
                  {blogsByMonth[monthYear].map((blog) => (
                    <BlogCard key={blog.createdAt.toISOString()} blog={blog} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
