"use client";

import Link from "next/link";

interface Props {
  title: string;
  onClick?: () => void;
  href?: string;
  color: "onlineOrange";
}

export const Button = ({ title, onClick, color, href }: Props) => {
  const colorStyle =
    color == "onlineOrange"
      ? "border-2 border-onlineOrange text-onlineOrange hover:text-orange-500 hover:border-orange-500"
      : "";

  const buttonStyle = `px-4 py-3 rounded-md  ${colorStyle}`;

  if (onClick) {
    return (
      <button className={`${buttonStyle}`} onClick={onClick}>
        {title}
      </button>
    );
  }
  if (href) {
    return (
      <Link className={`${buttonStyle}`} href={href}>
        {title}
      </Link>
    );
  }
};
