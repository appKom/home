"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Menu, X } from "lucide-react";

const navLinks = [
  {
    title: "Prosjekter",
    href: "/prosjekt",
  },
  {
    title: "Blogg",
    href: "/blogg",
  },
  {
    title: "Medlemmer",
    href: "/medlem",
  },
  {
    title: "Om oss",
    href: "/om",
  },
];

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
      className="fixed left-0 right-0 top-0 z-50 bg-transparent/80 text-gray-100 backdrop-blur-sm"
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
              className="flex items-center justify-center gap-4 transition-opacity hover:opacity-70"
            >
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
            className="hidden items-center gap-8 lg:flex"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex flex-row items-center gap-2 text-xl transition-colors hover:text-onlineOrange"
              >
                {link.title}

                <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
            <Link
              href="/kontakt"
              className="rounded-full bg-onlineBlue px-4 py-2 text-white transition-colors hover:bg-opacity-70"
            >
              Ta kontakt
            </Link>
          </motion.nav>

          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-100 transition-colors hover:text-onlineOrange"
              aria-label={`${isOpen ? "Lukk meny" : "Åpne meny"}`}
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
              className="mt-4 lg:hidden"
            >
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group w-full text-xl transition-colors hover:text-onlineOrange"
                    onClick={toggleMenu}
                  >
                    <span className="flex w-full flex-row items-center justify-between border-t border-gray-800 pt-2">
                      {link.title}
                      <ChevronRight className="mr-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
                <Link
                  href="/kontakt"
                  className="inline-block rounded-full bg-onlineBlue px-4 py-2 text-center text-lg text-white transition-colors hover:bg-opacity-70"
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
