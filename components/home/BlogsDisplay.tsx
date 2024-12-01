import { BlogCard } from "./BlogCard";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

export default async function BlogsDisplay() {
  const blogs = await prisma.article.findMany();

  return (
    <div className="py-8 flex flex-col md:flex-row justify-between gap-5">
      {blogs
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 3)
        .map((blog) => (
          <BlogCard blog={blog} key={blog.createdAt.toISOString()} />
        ))}
    </div>
  );
}
