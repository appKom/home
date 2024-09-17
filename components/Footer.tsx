import Link from "next/link";
import { GithubIcon } from "./icons/GithubIcon";
import { InstagramIcon } from "./icons/InstagramIcon";
import { FacebookIcon } from "./icons/FacebookIcon";
import { SlackIcon } from "./icons/SlackIcon";

export default function Footer() {
  const footerStyle = "text-white hover:text-onlineOrange";

  const footerLinks = [
    {
      name: "Slack",
      icon: <SlackIcon className={footerStyle} />,
      link: "https://onlinentnu.slack.com/",
    },
    {
      name: "Facebook",
      icon: <FacebookIcon className={footerStyle} />,
      link: "http://facebook.com/LinjeforeningenOnline",
    },
    {
      name: "Instagram",
      icon: <InstagramIcon className={footerStyle} />,
      link: "https://www.instagram.com/online_ntnu/",
    },
    {
      name: "Github",
      icon: <GithubIcon className={footerStyle} />,
      link: "https://github.com/appKom",
    },
  ];

  return (
    <footer className="min-w-full bg-gray-950/80 text-white">
      <div className="flex flex-col items-center justify-center py-5 gap-5">
        <div className="grid grid-cols-2 gap-8 sm:flex sm:flex-row sm:gap-12">
          {footerLinks.map((link) => {
            return (
              <Link
                href={link.link}
                key={link.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.icon}
              </Link>
            );
          })}
        </div>
        <div>
          Ta kontakt med{" "}
          <a
            className="font-semibold underline transition-all hover:text-onlineOrange"
            href="mailto:appkom@online.ntnu.no"
          >
            Appkom
          </a>{" "}
          :)
        </div>
        <p className="text-white text-sm">
          © {new Date().getFullYear()} Applikasjonskomiteen
        </p>
      </div>
    </footer>
  );
}
