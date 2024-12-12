import { ReactNode } from "react";

const BloggPageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="w-full flex justify-center min-h-screen">{children}</main>
  );
};

export default BloggPageLayout;
