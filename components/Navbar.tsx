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
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-white"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <path d="M12 18h.01" />
                </svg>
              </div>
              <span className="text-xl font-bold">Appkom</span>
            </Link>
          </motion.div>

          <motion.nav
            className="hidden md:flex items-center gap-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/prosjekt" className="hover:text-blue-400 transition-colors">Prosjekter</Link>
            <Link href="/blogg" className="hover:text-blue-400 transition-colors">Blogg</Link>
            <Link href="/medlem" className="hover:text-blue-400 transition-colors">Medlemmer</Link>
            <Link
              href="/kontakt"
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Kontakt oss
            </Link>
          </motion.nav>
        </header>
  );
}
