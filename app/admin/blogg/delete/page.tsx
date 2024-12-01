import BlogTable from "@/components/admin/BlogTable";
import { prisma } from "@/lib/prisma";

export default async function DeleteBloggPage() {
  const blogs = await prisma.article.findMany();

  return (
    <div className="min-h-screen w-full p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-100">Blogger</h1>
        <BlogTable blogs={blogs} />
      </div>
    </div>
  );
}
