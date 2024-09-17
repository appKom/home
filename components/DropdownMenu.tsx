"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";

export const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="relative block sm:hidden" ref={menuRef}>
      <div
        onClick={toggleMenu}
        className="cursor-pointer transition-transform duration-300"
      >
        <div
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          {isOpen ? (
            <IoMdClose className="text-white" size={32} />
          ) : (
            <GiHamburgerMenu className="text-white" size={32} />
          )}
        </div>
      </div>

      <div
        className={`absolute right-0 mt-2 w-48 z-50 bg-gray-800 border border-gray-500  text-white rounded-md shadow-lg transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <Link
          href="/"
          onClick={closeMenu}
          className="block px-4 py-2 text-lg hover:bg-tealBlue"
        >
          Hjem
        </Link>
        <Link
          href="/kontakt"
          onClick={closeMenu}
          className="block px-4 py-2 text-lg hover:bg-tealBlue"
        >
          Kontakt
        </Link>
        <Link
          href="/prosjekt"
          onClick={closeMenu}
          className="block px-4 py-2 text-lg hover:bg-tealBlue"
        >
          Prosjekter
        </Link>
        <Link
          href="/medlem"
          onClick={closeMenu}
          className="block px-4 py-2 text-lg hover:bg-tealBlue"
        >
          Medlemmer
        </Link>
      </div>
    </div>
  );
};
