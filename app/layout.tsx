import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Appkom",
  description: "Appkoms hjemmeside",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-lightBlue flex flex-col`}>
        <Navbar />
        <div>{children}</div>
      </body>
    </html>
  );
}
