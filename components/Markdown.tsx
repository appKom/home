import React from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface MarkdownComponentProps {
  node: any;
  children: React.ReactNode;
  [key: string]: any;
}

/* eslint-enable @typescript-eslint/no-explicit-any */
const MarkdownComponents: Record<string, React.FC<MarkdownComponentProps>> = {
  h1: ({ node, ...props }) => (
    <h1 className="text-4xl font-bold my-4" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-3xl font-semibold my-3" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-2xl font-medium my-2" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="text-base leading-relaxed my-2" {...props} />
  ),
  strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
  em: ({ node, ...props }) => <em className="italic" {...props} />,
  ul: ({ node, ...props }) => (
    <ul className="list-disc list-inside my-2" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-disc list-inside my-2" {...props} />
  ),
  li: ({ node, ...props }) => <li className="my-1" {...props} />,
};

export default MarkdownComponents;
