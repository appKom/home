import type React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { Background } from "@/components/Background";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#030712",
};

export const metadata: Metadata = {
  title: {
    default: "Appkom",
    template: "%s | Appkom",
  },
  description:
    "Applikasjonskomiteen (Appkom) er en komitè underlagt Online, linjeforeningen for informatikkstudenter ved NTNU. Vi utvikler og vedlikeholder applikasjoner og nettsider for Online.",
  keywords: [
    "Appkom",
    "Applikasjonskomiteen",
    "Online",
    "NTNU",
    "Linjeforening",
    "Informatikk",
    "Utvikling",
    "Programmering",
    "Studentorganisasjon",
  ],
  authors: [{ name: "Appkom", url: "https://appkom.no" }],
  creator: "Appkom",
  publisher: "Online, Linjeforeningen for Informatikk, NTNU",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://appkom.no",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "no_NO",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://appkom.no",
    siteName: "Appkom",
    title: "Appkom | Applikasjonskomiteen ved Online, NTNU",
    description:
      "Applikasjonskomiteen (Appkom) er en komitè underlagt Online, linjeforeningen for informatikkstudenter ved NTNU. Vi utvikler og vedlikeholder applikasjoner og nettsider for Online.",
    images: [
      {
        url: "/logos/appkom-logo-m-bakgrunn.png",
        width: 1200,
        height: 1200,
        alt: "Appkom logo og banner",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logos/favicon.ico" },
      { url: "/logos/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/logos/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/logos/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  applicationName: "Appkom",
  category: "technology",
  verification: {
    google: "ru0v97yOiF-Jj2kWjz0-rnTURm7yrVWVbQmTZKkQGl8",
  },
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

        <div className="flex min-h-screen flex-col">
          <Background />
          <Navbar />
          <div className="mx-auto mt-24 w-full max-w-screen-xl text-white">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
