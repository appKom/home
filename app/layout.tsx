import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { Background } from "@/components/Background";

export const metadata: Metadata = {
  title: "Appkom",
  description: "Appkoms hjemmeside",
  keywords:
    "Appkom, appkom, appkoms hjemmeside, Applikasjonskomiteen, Online, Online NTNU, Online NTNU Applikasjonskomiteen, Online NTNU Appkom, Online Linjeforening",
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
          content="ru0v97yOiF-Jj2kWjz0-rnTURm7yrVWVbQmTZKkQGl8"
        />
      </head>
      <body>
        <Toaster />
        <Analytics />

        <div className="min-h-screen flex flex-col">
          <Background />
          <Navbar />
          <div className="flex-grow flex mt-24 items-center justify-center w-full max-w-screen-xl mx-auto text-white">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
