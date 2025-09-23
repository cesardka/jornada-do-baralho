import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { I18nProvider } from "../contexts/I18nContext";
import { ImageIcon } from "lucide-react";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        <header className="p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
          <nav className="container mx-auto flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Image
                width={120}
                height={60}
                src="/images/jornada-do-baralho.png"
                alt="Jornada do Baralho logo"
                className="w-auto h-12"
              />
            </Link>
            <div className="flex items-center gap-2 md:gap-4">
              <Link
                href="/galeria"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <ImageIcon size={20} />
                <span className="hidden md:inline">Galeria</span>
              </Link>
            </div>
          </nav>
        </header>
        <main className="container mx-auto p-4 md:p-8">{children}</main>
        <footer className="text-center p-6 border-t mt-12 bg-white">
          <p className="text-sm text-gray-500 flex flex-col gap-1 space-y-1">
            <span>César Hoffmann @ {new Date().getFullYear()}</span>
            <span>Alguns direitos reservados, mas não sei ainda quais!</span>
          </p>
        </footer>
      </div>
    </I18nProvider>
  );
}
