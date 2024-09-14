import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
        <div className="min-h-screen">
          {" "}
          <Navbar />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
