import { memberType, slugParams } from "@/lib/types";
import Custom404 from "@/app/not-found";
import Image from "next/image";
import { TbPencilCode } from "react-icons/tb";
import Link from "next/link";
import { FaClock } from "react-icons/fa";
import { formatDate } from "@/lib/utils/dateUtils";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Metadata } from "next";
import MarkdownComponents from "@/components/Markdown";
import { HeaderText } from "@/components/headerText";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(props: {
  params: slugParams;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const decodedSlug = decodeURIComponent(slug);

  const article = await prisma.article.findUnique({
    where: { slug: decodedSlug },
    include: { author: true },
  });

  if (!article) {
    return {
      title: "Artikkelen ble ikke funnet",
    };
  }

  const description = article.description
    .replace(/[#*`]/g, "")
    .slice(0, 160)
    .trim();

  return {
    title: article.title,
    description: description,
    openGraph: {
      title: article.title,
      description: description,
      type: "article",
      publishedTime: article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${article.slug}`,
      images: [
        {
          url: article.imageUri,
          width: 1200,
          height: 630,
          alt: article.imageDescription,
        },
      ],
      siteName: "Appkom",
      locale: "no_NO",
      authors: article.author ? [article.author.name] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: description,
      images: [article.imageUri],
      creator: article.author
        ? `@${article.author.name.replace(/\s+/g, "")}`
        : undefined,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${article.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    authors: article.author ? [{ name: article.author.name }] : [],
    keywords: article.title.split(" ").filter((word) => word.length > 3),
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://appkom.no",
    ),
  };
}

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    select: { slug: true },
  });

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage(props: { params: slugParams }) {
  const { slug } = await props.params;
  const decodedSlug = decodeURIComponent(slug);

  const blog = await prisma.article.findUnique({
    where: { slug: decodedSlug },
    include: { author: true },
  });

  const author: memberType | undefined = blog?.author;

  if (!blog) {
    return <Custom404 />;
  }

  return (
    <main className="flex w-full flex-col">
      <div className="flex w-full justify-center">
        <Image
          src={blog.imageUri}
          alt={`${blog.title} illustrasjon`}
          width={1200}
          height={1200}
          className="max-h-96 w-full object-cover"
        />
      </div>
      <div className="flex flex-col px-6">
        <div className="flex flex-col justify-between pt-8 sm:flex-row">
          <HeaderText title={blog.title} />
          {author && (
            <Link
              href={"/medlem/" + author.href}
              className="group mt-4 flex flex-row items-center gap-2 text-orange-600 hover:text-onlineOrange sm:mt-0"
            >
              <TbPencilCode
                size={32}
                className="group-hover:text-onlineOrange"
              />
              <h2 className="group-hover:text-onlineOrange">{author.name}</h2>
              {author.imageUri && (
                <Image
                  src={author.imageUri}
                  alt={"image of " + author.name}
                  width={50}
                  height={50}
                  className="size-16 rounded-full border-2 border-gray-600 group-hover:border-onlineOrange"
                />
              )}
            </Link>
          )}
        </div>

        <div className="flex flex-row gap-2 pt-4">
          <FaClock size={32} />
          <p>{`Sist oppdatert: ${formatDate(blog.createdAt)}`}</p>
        </div>
      </div>
      <article className="w-full whitespace-pre-wrap break-words px-6 py-12">
        <ReactMarkdown
          className="w-full"
          rehypePlugins={[rehypeRaw]}
          components={MarkdownComponents}
        >
          {blog.description}
        </ReactMarkdown>
      </article>
    </main>
  );
}
