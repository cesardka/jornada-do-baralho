import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavMenu from "./components/nav-menu";
import ProgressBar from "./components/progress-bar";

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
        <NavMenu />
        {children}
        <ProgressBar />
      </body>
    </html>
  );
}
