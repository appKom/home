import React from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface MarkdownComponentProps {
  children: React.ReactNode;
  [key: string]: any;
}

/* eslint-enable @typescript-eslint/no-explicit-any */
const MarkdownComponents: Record<string, React.FC<MarkdownComponentProps>> = {
  h1: ({ ...props }) => <h1 className="text-4xl font-bold my-4" {...props} />,
  h2: ({ ...props }) => (
    <h2 className="text-3xl font-semibold my-3" {...props} />
  ),
  h3: ({ ...props }) => <h3 className="text-2xl font-medium my-2" {...props} />,
  p: ({ ...props }) => (
    <p className="text-base leading-relaxed my-2" {...props} />
  ),
  strong: ({ ...props }) => <strong className="font-bold" {...props} />,
  em: ({ ...props }) => <em className="italic" {...props} />,
  ul: ({ ...props }) => (
    <ul className="list-disc list-inside my-2" {...props} />
  ),
  ol: ({ ...props }) => (
    <ol className="list-disc list-inside my-2" {...props} />
  ),
  li: ({ ...props }) => <li className="my-1" {...props} />,
  img: ({ ...props }) => (
    <img
      className="my-4  max-w-full object-contain h-auto"
      {...props}
      style={{
        width: "100%",
        margin: "0 auto",
      }}
    />
  ),
};

export default MarkdownComponents;
