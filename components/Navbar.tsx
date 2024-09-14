import { Button } from "./Button";
import Link from "next/link";
import { DropdownMenu } from "./DropdownMenu";

export default function Navbar() {
  return (
    <div className="bg-tealBlue w-full text-white">
      <div className="w-full flex justify-center">
        <nav className="flex items-center justify-between flex-wrap px-5 py-5 bg-tealBlue w-full max-w-screen-2xl">
          <Link href={"/"}>
            <h1 className="font-semibold text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-3xl hover:text-gray-300">
              <span>Appkom</span>
            </h1>
          </Link>

          <div className="hidden sm:block">
            <Button title="Kontakt oss" href="/kontakt" color="onlineOrange" />
          </div>
          <DropdownMenu />
        </nav>
      </div>
    </div>
  );
}
