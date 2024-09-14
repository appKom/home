import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="py-6 px-6 w-full max-w-screen-lg text-gray-700">
        <main className="flex flex-col">
          <div className="flex flex-row justify-between">
            <div>
              <div className="py-6 flex flex-row justify-between">
                <h1 className="text-3xl font-semibold ">
                  Applikasjonskomiteen
                </h1>
                <Image
                  src={"/logos/appkom-logo.svg"}
                  alt={"Appkom logo"}
                  width={200}
                  height={200}
                />
              </div>
              <article>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
                numquam fugit adipisci dicta alias explicabo saepe. Sit aperiam,
                adipisci aut quis, ipsum voluptates sunt quisquam velit
                distinctio voluptatem quo. Quam? Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Officia ut recusandae laborum odio
                impedit, consectetur possimus mollitia distinctio voluptates,
                voluptas unde quidem accusamus. Maiores error neque quia labore
                ipsa ipsam. Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Provident, distinctio debitis. At magni quae cumque error
                odit ab voluptatibus dolorem impedit vero adipisci, qui
                assumenda, cum quam iusto vel voluptas. Lorem, ipsum dolor sit
                amet consectetur adipisicing elit. Aliquam hic modi iusto
                nesciunt illo impedit. Ad modi eaque, commodi totam eligendi
                esse beatae temporibus, reiciendis consequatur repellendus error
                tenetur laborum. Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Deserunt, adipisci doloribus. Pariatur, nemo!
                Totam atque natus vitae laboriosam ullam facere nihil illo quia,
                enim minima ab. Dolorum amet ipsam reprehenderit. Lorem ipsum
                dolor sit amet consectetur adipisicing elit. Quos, dolorum
                perferendis. Rem ut asperiores similique incidunt molestiae,
                quod saepe mollitia quisquam rerum provident accusamus,
                excepturi doloremque dolores eligendi fugit laboriosam. Lorem
                ipsum dolor sit amet consectetur adipisicing elit. Maiores
                laboriosam aspernatur sunt rerum nemo earum corrupti eveniet
                molestiae totam, impedit dolore iure, ipsa facilis excepturi
                similique voluptas, quam asperiores ipsam.
              </article>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
