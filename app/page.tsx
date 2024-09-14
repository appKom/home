import Image from "next/image";
import { blogs } from "@/lib/blog";
import { BlogCard } from "@/components/home/BlogCard";
import { Button } from "@/components/Button";

export default function Home() {
  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="py-6 px-6 w-full max-w-screen-lg text-gray-700">
        <main className="flex flex-col">
          <div className="py-6">
            <div className="flex flex-col sm:flex-row items-start justify-between">
              <div>
                <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-semibold">
                  Applikasjonskomiteen
                </h1>
                <article className="mt-6">
                  Applikasjonskomiteen (Appkom) er en komité under Online,
                  linjeforeningen for informatikk ved NTNU. Appkoms mål er å
                  utvikle programvare som er nyttig og underholdende for
                  informatikkstudenter.
                </article>
              </div>
              <Image
                src={"/logos/appkom-logo.svg"}
                alt={"Appkom logo"}
                width={150}
                height={150}
                className="ml-4 sm:ml-4 mt-4 sm:mt-0"
              />
            </div>
          </div>

          <div className="w-full py-8 border-2 rounded-lg border-gray-700">
            <article className="p-4">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum
              tempora magni vel, odit consequuntur molestias ipsa commodi.
              Natus, enim unde sint sit impedit doloremque consectetur
              consequatur, et voluptate eveniet iure. Lorem ipsum dolor sit,
              amet consectetur adipisicing elit. Animi explicabo vel tempore
              odit modi porro iure accusamus voluptas consequatur quia iste,
              quam laudantium voluptates asperiores, incidunt veniam provident
              commodi unde. Lorem ipsum dolor sit amet consectetur, adipisicing
              elit. Quibusdam nihil deleniti optio quas quos, magni porro
              commodi sit beatae omnis quo, suscipit illo ex ea exercitationem,
              dolorum ad corporis officia!
            </article>
          </div>
          <div className="py-8">
            <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-semibold">
              Blogg
            </h1>
            <div className="py-8 flex flex-row justify-between">
              {blogs
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, 3)
                .map((blog) => (
                  <BlogCard blog={blog} key={blog.createdAt.toISOString()} />
                ))}
            </div>
            <div className="flex justify-center items-center mt-2">
              <Button title="Les mer" href="/artikler" color={"onlineOrange"} />
            </div>
          </div>
          <div className="pb-8">
            <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-semibold">
              Prosjekter
            </h1>
          </div>
          <div className="py-8">
            <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-semibold">
              Medlemmer
            </h1>
          </div>
        </main>
      </div>
    </div>
  );
}
