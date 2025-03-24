import { BlogCard } from "@/components/home/BlogCard";
import { articleType } from "@/lib/types";
import { getMonthNameInNorwegian } from "@/lib/utils/dateUtils";
import { HeaderText } from "@/components/headerText";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";

export default async function BlogsPage() {
  const unsortedBlogs = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });

  const blogs = unsortedBlogs?.sort((a, b) => {
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  if (!blogs) {
    return <div>No blogs found.</div>;
  }

  const blogsByMonth: Record<string, articleType[]> = blogs.reduce(
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
    {} as Record<string, articleType[]>
  );

  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="py-6 px-6 w-full">
        <main className="flex flex-col gap-5">
          <HeaderText title="Blogg" />
          <Suspense>
            <div className="flex flex-col gap-5">
              {Object.keys(blogsByMonth)
                .reverse()
                .map((monthYear) => (
                  <div key={monthYear}>
                    <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl font-semibold">
                      {monthYear}
                    </h2>
                    <div className="flex flex-col gap-5">
                      {blogsByMonth[monthYear].map((blog) => (
                        <BlogCard
                          key={blog.createdAt.toISOString()}
                          blog={blog}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
