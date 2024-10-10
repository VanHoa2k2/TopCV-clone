import Link from "next/link";
import React from "react";

interface LinkItem {
  href: string;
  text: string;
}

interface LinkGroupProps {
  title: string;
  links: LinkItem[];
}

const LinkGroup: React.FC<LinkGroupProps> = ({ title, links }) => {
  return (
    <div className="mb-7">
      <div className="text-[#212f3f] text-base font-semibold mb-2.5">
        {title}
      </div>
      <div>
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            target="_blank"
            className="text-[#4d5965] text-sm font-normal mb-3 block"
          >
            {link.text}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LinkGroup;
