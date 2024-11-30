"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 text-gray-100 bg-transparent/90"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="flex items-center justify-center gap-4 hover:opacity-70 transition-opacity"
            >
              <Image
                src="/logos/appkom-logo.svg"
                alt="Appkom logo"
                width={50}
                height={50}
                className="h-10 w-10 "
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
            <Link
              href="/prosjekt"
              className="hover:text-onlineOrange transition-colors"
            >
              Prosjekter
            </Link>
            <Link
              href="/blogg"
              className="hover:text-onlineOrange transition-colors"
            >
              Blogg
            </Link>
            <Link
              href="/medlem"
              className="hover:text-onlineOrange transition-colors"
            >
              Medlemmer
            </Link>
            <Link
              href="/kontakt"
              className="px-4 py-2 bg-onlineBlue text-white rounded-full hover:bg-opacity-70 transition-colors"
            >
              Ta kontakt
            </Link>
          </motion.nav>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-100 hover:text-onlineOrange transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4"
            >
              <nav className="flex flex-col gap-4">
                <Link
                  href="/prosjekt"
                  className="text-xl hover:text-onlineOrange transition-colors"
                  onClick={toggleMenu}
                >
                  Prosjekter
                </Link>
                <Link
                  href="/blogg"
                  className="text-xl hover:text-onlineOrange transition-colors"
                  onClick={toggleMenu}
                >
                  Blogg
                </Link>
                <Link
                  href="/medlem"
                  className="text-xl hover:text-onlineOrange transition-colors"
                  onClick={toggleMenu}
                >
                  Medlemmer
                </Link>
                <Link
                  href="/kontakt"
                  className="text-lg px-4 py-2 bg-onlineBlue text-white rounded-full hover:bg-opacity-70 transition-colors inline-block text-center"
                  onClick={toggleMenu}
                >
                  Ta kontakt
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
