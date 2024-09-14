"use client";

interface Props {
  title: string;
  onClick?: () => void;
  href?: string;
  color: "lightBlue" | "onlineOrange";
}

export const Button = ({ title, onClick, color, href }: Props) => {
  const buttonStyle = `px-4 py-2 bg-${color} rounded-md`;

  if (onClick) {
    return (
      <button className={`${buttonStyle}`} onClick={onClick}>
        {title}
      </button>
    );
  }
  if (href) {
    return (
      <a className={`${buttonStyle}`} href={href}>
        {title}
      </a>
    );
  }
};
