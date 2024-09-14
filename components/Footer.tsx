import Link from "next/link";
import { BsSlack, BsFacebook, BsInstagram, BsGithub } from "react-icons/bs";

export default function Footer() {
  const footerLinkSize = 35;
  const footerLinks = [
    {
      name: "Slack",
      icon: <BsSlack size={footerLinkSize} />,
      link: "https://onlinentnu.slack.com/",
    },
    {
      name: "Facebook",
      icon: <BsFacebook size={footerLinkSize} />,
      link: "http://facebook.com/LinjeforeningenOnline",
    },
    {
      name: "Instagram",
      icon: <BsInstagram size={footerLinkSize} />,
      link: "https://www.instagram.com/online_ntnu/",
    },
    {
      name: "Github",
      icon: <BsGithub size={footerLinkSize} />,
      link: "https://github.com/appKom",
    },
  ];

  return (
    <footer className="min-w-full bg-tealBlue">
      <div className="flex flex-col items-center justify-center py-5">
        <div className="flex flex-row gap-5">
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
      </div>
    </footer>
  );
}
