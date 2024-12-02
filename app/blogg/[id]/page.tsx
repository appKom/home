import { articleType, memberType, tParams } from "@/lib/types";
import Custom404 from "@/app/not-found";
import Image from "next/image";
import { TbPencilCode } from "react-icons/tb";
import Link from "next/link";
import { FaClock } from "react-icons/fa";
import { formatDate } from "@/lib/utils/dateUtils";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { members } from "@/lib/members";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const revalidate = 36000;

export async function generateMetadata(props: {
  params: tParams;
}): Promise<Metadata> {
  const { id } = await props.params;

  const articleTitle = decodeURIComponent(id);

  return {
    title: `${decodeURIComponent(articleTitle)}`,
  };
}

export default async function ArticlePage(props: { params: tParams }) {
  const { id } = await props.params;
  const decodedId = decodeURIComponent(id);

  const blog: articleType | undefined =
    (await prisma.article.findFirst({
      where: {
        title: decodedId,
      },
    })) || undefined;

  if (!blog) {
    return <Custom404 />;
  }

  const author: memberType | undefined = members.find(
    (member) => member.id === blog.authorId
  );

  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="w-full">
        <main className="flex flex-col">
          <div className="w-full flex justify-center">
            <Image
              src={blog.imageUri}
              alt={`${blog.title} illustrasjon`}
              width={1200}
              height={1200}
              className="w-full object-cover max-h-96"
            />
          </div>
          <div className="flex flex-col px-6">
            <div className="flex flex-col sm:flex-row justify-between pt-8">
              <h1 className="font-bold text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-4xl">
                {blog.title}
              </h1>
              {author && (
                <Link
                  href={author.href}
                  className="flex flex-row items-center gap-2 text-orange-600 hover:text-onlineOrange mt-4 sm:mt-0"
                >
                  <TbPencilCode size={32} />
                  <h2>{author.name}</h2>
                  {author.imageUri && (
                    <Image
                      src={author.imageUri}
                      alt={"image of " + author.name}
                      width={50}
                      height={50}
                      className="rounded-full"
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
          <article className="w-full break-words whitespace-pre-wrap px-6 py-12">
            <ReactMarkdown className="w-full" rehypePlugins={[rehypeRaw]}>
              {blog.description}
            </ReactMarkdown>
          </article>
        </main>
      </div>
    </div>
  );
}
