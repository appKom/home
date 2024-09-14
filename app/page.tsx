import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="py-6 px-6 w-full max-w-screen-lg text-gray-700">
        <main className="flex flex-col">
          <div className="py-6">
            <div className="flex flex-row items-start justify-between">
              <div>
                <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-semibold ">
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
                className="ml-4 float-left"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
