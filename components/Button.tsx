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
    color == "onlineOrange" ? "bg-onlineOrange hover:bg-orange-400" : "";

  const buttonStyle = `px-4 py-2 rounded-md  ${colorStyle}`;

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
