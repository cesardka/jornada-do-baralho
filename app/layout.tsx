import { type Metadata, type Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import "@/app/styles/fonts.css";
import "leaflet/dist/leaflet.css";
import React from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  title: "Jornada do Baralho",
  description: "Desbravando as cartas rumo ao iPad",
  keywords: [
    "cartas",
    "baralho",
    "desafio",
    "iPad",
    "jornada",
    "nerdcast",
    "nerdcaster",
    "jovem nerd",
  ],
  authors: [
    { name: "César Hoffmann", url: "https://github.com/cesardka" },
    { name: "Lena Franzz", url: "https://www.studiochifrezz.com/" },
  ],
  creator: "César Hoffmann",
  publisher: "César Hoffmann",
  applicationName: "Jornada do Baralho",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  category: "entertainment",
  classification: "Card Game Challenge",
  openGraph: {
    title: "Jornada do Baralho",
    description: "Desbravando as cartas rumo ao iPad",
    url: "https://jornadadobaralho.com.br",
    siteName: "Jornada do Baralho",
    images: [
      {
        url: "/images/jornada-do-baralho.png",
        width: 1200,
        height: 630,
        alt: "Jornada do Baralho - Desbravando as cartas rumo ao iPad",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jornada do Baralho",
    description: "Desbravando as cartas rumo ao iPad",
    images: ["/images/jornada-do-baralho.png"],
    creator: "@cesardka",
    site: "https://jornadadobaralho.com.br",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      {
        url: "/images/icons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/images/icons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/images/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        url: "/images/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/images/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EKW4K5RXWG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EKW4K5RXWG');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
