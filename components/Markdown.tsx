import React from "react";
import Image from "next/image";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface MarkdownComponentProps {
  children: React.ReactNode;
  [key: string]: any;
}

/* eslint-enable @typescript-eslint/no-explicit-any */
const MarkdownComponents: Record<string, React.FC<MarkdownComponentProps>> = {
  h1: ({ ...props }) => <h1 className="my-4 text-4xl font-bold" {...props} />,
  h2: ({ ...props }) => (
    <h2 className="my-3 text-3xl font-semibold" {...props} />
  ),
  h3: ({ ...props }) => <h3 className="my-2 text-2xl font-medium" {...props} />,
  p: ({ ...props }) => (
    <div className="my-2 text-base leading-relaxed" {...props} />
  ),
  a: ({ ...props }) => (
    <a
      className="text-onlineOrange underline hover:text-orange-500"
      {...props}
    />
  ),
  strong: ({ ...props }) => <strong className="font-bold" {...props} />,
  em: ({ ...props }) => <em className="italic" {...props} />,
  ul: ({ ...props }) => (
    <ul className="my-2 list-inside list-disc" {...props} />
  ),
  ol: ({ ...props }) => (
    <ol className="my-2 list-inside list-disc" {...props} />
  ),
  li: ({ ...props }) => <li className="my-1" {...props} />,
  img: ({ src, alt, ...props }) => (
    <div className="my-4">
      <Image
        src={src || "/default-image.svg"}
        alt={alt || "Image"}
        width={1200}
        height={1200}
        className="w-full object-cover"
        {...props}
      />
    </div>
  ),
};

export default MarkdownComponents;
