import React from "react";

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
    <p className="my-2 text-base leading-relaxed" {...props} />
  ),
  a: ({ ...props }) => (
    <a
      className="hover:text-onlineOrangeHover text-onlineOrange underline"
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
  img: ({ ...props }) => (
    <img
      className="my-4 h-auto max-w-full object-contain"
      {...props}
      style={{
        width: "100%",
        margin: "0 auto",
      }}
    />
  ),
};

export default MarkdownComponents;
