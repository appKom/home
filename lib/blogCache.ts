import { prisma } from "@/lib/prisma";
import { Article, Member } from "@prisma/client";

interface CachedBlog {
  data: (Article & { author: Member }) | null;
  fetchedAt: number;
}

interface CachedBlogList {
  data: (Article & { author: Member })[] | null;
  fetchedAt: number;
}

const individualBlogCache = new Map<string, CachedBlog>();
const blogListCache = new Map<string, CachedBlogList>();

const CACHE_TTL = 3600 * 1000 * 24;

export const getBlogByTitle = async (
  title: string
): Promise<(Article & { author: Member }) | null> => {
  const now = Date.now();
  const cached = individualBlogCache.get(title);

  if (cached && now - cached.fetchedAt < CACHE_TTL) {
    return cached.data;
  }

  const blog = await prisma.article.findFirst({
    where: { title },
    include: { author: true },
  });

  individualBlogCache.set(title, { data: blog, fetchedAt: now });

  return blog;
};

export const getAllBlogs = async (): Promise<
  (Article & { author: Member })[] | null
> => {
  const now = Date.now();
  const cacheKey = "allBlogs";
  const cached = blogListCache.get(cacheKey);

  if (cached && now - cached.fetchedAt < CACHE_TTL) {
    return cached.data ? [...cached.data] : null;
  }

  const blogs = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  blogListCache.set(cacheKey, { data: blogs, fetchedAt: now });

  blogs.forEach((blog) => {
    individualBlogCache.set(blog.title, { data: blog, fetchedAt: now });
  });

  return blogs;
};

export const clearBlogCache = () => {
  individualBlogCache.clear();
  blogListCache.clear();
};
