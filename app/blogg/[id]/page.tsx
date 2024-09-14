import { Metadata } from "next";
import { headers } from "next/headers";
import { blogs } from "@/lib/blog";
import { blogType } from "@/lib/types";
import Custom404 from "@/app/not-found";
import Image from "next/image";
import { TbPencilCode } from "react-icons/tb";
import Link from "next/link";
import { FaClock } from "react-icons/fa";
import { formatDate } from "@/lib/dateUtils";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface Params {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto");

  if (!host || !protocol) {
    return {
      title: "Error",
    };
  }

  const url = new URL(`${protocol}://${host}/artikkel/${params.id}`);
  const { pathname } = url;

  const parts = pathname.split("-");
  const title = decodeURIComponent(parts.slice(1).join("-"));

  return {
    title: `${title}`,
  };
}

export default async function ArticlePage({ params }: Params) {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto");

  const url = new URL(`${protocol}://${host}/artikkel/${params.id}`);
  const { pathname } = url;

  const parts = pathname.split("-");
  const encodedBlogTitle = parts[0].split("/").pop();
  const blogTitle = decodeURIComponent(encodedBlogTitle ?? "");

  const blog: blogType | undefined = blogs.find(
    (blog) => blog.title === blogTitle
  );

  if (!blog) {
    return <Custom404 />;
  }

  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="w-full max-w-screen-lg text-gray-700">
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
            <div className="flex flex-col sm:flex-row justify-between py-8">
              <h1 className=" font-bold text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-4xl">
                {blog.title}
              </h1>
              <Link
                href={blog.author?.href || "/"}
                className="flex flex-row items-center gap-2 hover:text-onlineOrange mt-4 sm:mt-0"
              >
                <TbPencilCode size={32} />
                <h2>{blog.author?.name}</h2>
                {blog.author?.imageUri && (
                  <Image
                    src={blog.author?.imageUri}
                    alt={"image of " + blog.author?.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                )}
              </Link>
            </div>

            <div className="">
              <div className="flex flex-row gap-4">
                <FaClock size={32} />
                <p>{`Sist oppdatert: ${formatDate(blog.createdAt)}`}</p>
              </div>
            </div>
          </div>
          <article className="w-full break-words whitespace-pre-wrap px-6 py-12">
            <ReactMarkdown className="w-full" rehypePlugins={[rehypeRaw]}>
              {blog.content}
            </ReactMarkdown>
          </article>
        </main>
      </div>
    </div>
  );
}
