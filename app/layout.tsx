import { type Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Jornada do Baralho",
  description: "Desbravando as cartas rumo ao iPad",
  openGraph: {
    title: "Jornada do Baralho",
    description: "Desbravando as cartas rumo ao iPad",
    images: ["/images/jornada-do-baralho.png"],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jornada do Baralho",
    description: "Desbravando as cartas rumo ao iPad",
    images: ["/images/jornada-do-baralho.png"],
  },
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
