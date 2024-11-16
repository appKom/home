import { Button } from "./Button";
import Image from "next/image";
import Link from "next/link";
import { DropdownMenu } from "./DropdownMenu";

export default function Navbar() {
  return (
    <div className="w-full text-white">
      <div className="w-full flex justify-center">
        <nav className="flex items-center justify-between flex-wrap py-5 w-full px-5">
          <Link
            href={"/"}
            className="flex items-center justify-center gap-5 group hover:text-gray-300"
          >
            <Image
              src={"/logos/appkom-logo.svg"}
              alt={"Appkom logo"}
              width={50}
              height={50}
              className="transition-all cursor-pointer group-hover:opacity-60"
            />
            <h1 className="font-semibold text-2xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl">
              <span className="group-hover:text-gray-300">Appkom</span>
            </h1>
          </Link>
          <div className="hidden md:flex flex-row gap-8 text-xl">
            <Link href="/prosjekt" passHref>
              <p className="text-white hover:text-gray-300">Prosjekter</p>
            </Link>
            <Link href="/blogg" passHref>
              <p className="text-white hover:text-gray-300">Blogg</p>
            </Link>
            <Link href="/medlem" passHref>
              <p className="text-white hover:text-gray-300">Medlemmer</p>
            </Link>
          </div>

          <div className="hidden sm:block">
            <Button title="Kontakt oss" href="/kontakt" color="onlineOrange" />
          </div>
          <DropdownMenu />
        </nav>
      </div>
    </div>
  );
}