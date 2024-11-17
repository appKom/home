"use client"

import { Button } from "./Button";
import Image from "next/image";
import Link from "next/link";
import { DropdownMenu } from "./DropdownMenu";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <header className="container text-gray-100 mx-auto px-4 py-6 flex items-center justify-between">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/" className="flex items-center justify-center gap-4">
          <Image
            src="/logos/appkom-logo.svg"
            alt="Appkom logo"
            width={50}
            height={50}
            className="h-10 w-10"
          />
          <span className="text-xl font-bold">Appkom</span>
        </Link>
      </motion.div>

      <motion.nav
        className="hidden md:flex items-center gap-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Link href="/prosjekt" className="hover:text-onlineOrange transition-colors">Prosjekter</Link>
        <Link href="/blogg" className="hover:text-onlineOrange transition-colors">Blogg</Link>
        <Link href="/medlem" className="hover:text-onlineOrange transition-colors">Medlemmer</Link>
        <Link
          href="/kontakt"
          className="px-4 py-2 bg-onlineBlue text-white rounded-full hover:bg-opacity-70 transition-colors"
        >
          Ta kontakt
        </Link>
        <DropdownMenu /> {/* TODO: fix mobile menu */}
      </motion.nav>
    </header>
  );
}