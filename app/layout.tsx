import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

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
      <head>
        <meta
          name="google-site-verification"
          content="Mpx63Er4zVk_7W6f00g6EKCnxeeGC0v9kf63kzn-b0s"
        />
      </head>
      <body className={`bg-lightBlue flex flex-col`}>
        <Toaster />
        <div className="min-h-screen">
          <Navbar />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
