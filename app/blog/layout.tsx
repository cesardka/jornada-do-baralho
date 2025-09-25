import { ReactNode } from "react";
import { I18nProvider } from "../contexts/I18nContext";
import NewsletterForm from "@/components/ui/newsletter-form/newsletter-form";
import BlogNavMenu from "../sections/nav-menu/blog-nav-menu";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans bg-[url('/images/paper-texture-bg2.jpg')] bg-cover bg-center flex flex-col">
        <BlogNavMenu />

        <main className="container mx-auto px-1 sm:p-4 md:p-8 flex-1">
          {children}
        </main>

        <footer className="text-center p-6">
          <div className="max-w-6xl mx-auto mb-6">
            <p className="text-sm font-bold">
              Receba as próximas atualizações direto do seu e-mail
            </p>
            <NewsletterForm label="seufrancisco@debusao.com.ar" />
          </div>

          <p className="text-sm text-gray-500 flex flex-col gap-1 space-y-1">
            <span>César Hoffmann @ {new Date().getFullYear()}</span>
            <span>Alguns direitos reservados, mas não sei ainda quais!</span>
          </p>
        </footer>
      </div>
    </I18nProvider>
  );
}
