"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useI18n } from "@/app/contexts/I18nContext";
import { bebasNeue } from "@/app/fonts";
import NewsletterForm from "@/components/ui/newsletter-form/newsletter-form";

export default function ReadTheBlog() {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <section
      id="readTheBlog"
      className="segment relative w-full min-h-screen overflow-hidden bg-[url('/images/paper-texture-bg2.jpg')] bg-cover bg-center"
    >
      {/* Background Card Images */}
      <div className="absolute -left-10 bottom-0 pointer-events-none">
        {/* Alottoni Card - positioned further left */}
        <Image
          src="/images/card/nerdcast-k-alottoni.webp"
          alt="Nerdcast Alottoni Card"
          width={200}
          height={300}
          className="absolute bottom-3 left-0 w-32 md:w-72 h-auto max-w-72 transform rotate-[5deg] border-solid rounded-md border-gray-500 shadow-lg shadow-gray-200"
        />
        {/* Azaghal Card - positioned slightly to the right and overlapping */}
        <Image
          src="/images/card/nerdcast-k-azaghal.webp"
          alt="Nerdcast Azaghal Card"
          width={200}
          height={300}
          className="absolute -bottom-12 left-32 w-32 md:w-72 h-auto max-w-72 transform rotate-[15deg] border-solid rounded-md border-gray-500 shadow-lg shadow-gray-200"
        />
      </div>

      <div className="absolute -right-10 bottom-0 pointer-events-none">
        {/* Sra Jovem Nerd Card - positioned further right */}
        <Image
          src="/images/card/nerdcast-q-srajovemnerd.webp"
          alt="Nerdcast Alottoni Card"
          width={200}
          height={300}
          className="absolute bottom-3 right-0 w-32 md:w-72 h-auto max-w-72 transform rotate-[-5deg] border-solid rounded-md border-gray-500 shadow-lg shadow-gray-200"
        />
        {/* Portuguesa Card - positioned slightly to the left and overlapping */}
        <Image
          src="/images/card/nerdcast-q-portuguesa.webp"
          alt="Nerdcast Portuguesa Card"
          width={200}
          height={300}
          className="absolute -bottom-12 right-32 w-32 md:w-72 h-auto max-w-72 transform rotate-[-15deg] border-solid rounded-md border-gray-500 shadow-lg shadow-gray-200"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-32 py-12 md:py-20 relative z-10">
        <h2
          className={`${bebasNeue.className} text-[64px] md:text-[28px] lg:text-[64px] xl:text-[128px] leading-none font-extrabold mb-2 uppercase tracking-wide text-black drop-shadow-[-3px_6px_2px_#CCCCCC] text-center`}
        >
          {t("readTheBlog.title")} <br /> {t("readTheBlog.title1")}
        </h2>

        <div className="flex flex-col items-center justify-center mb-6 mt-0">
          <p className="text-sm italic text-center">
            {t("readTheBlog.description_1_quote_rebelde")}
          </p>
        </div>

        <div className="pt-4 space-y-6 text-lg text-center">
          <div className="flex flex-col items-center justify-center space-y-0">
            <p>{t("readTheBlog.description_2_lento_e_espacado")}</p>
            <p>{t("readTheBlog.description_21_jornada_thanos")}</p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-6 md:space-y-0">
            <p>{t("readTheBlog.description_3_apesar_disso")}</p>
            <p>{t("readTheBlog.description_3_vem_ai")}</p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-2 py-4 font-extrabold text-center">
            <p className="text-2xl md:text-5xl">
              {t("readTheBlog.description_4_curtiu")}
            </p>
            <p className="text-xl md:text-2xl">
              {t("readTheBlog.description_6_quer_saber")}
            </p>
            <p className="text-lg md:text-xl">
              {t("readTheBlog.description_5_curiosidade")}
            </p>
          </div>

          {/* Blog Button */}
          <p className="md:w-2/3 flex justify-center mx-auto pb-24 md:pb-0">
            <button
              onClick={() => router.push("/blog")}
              className={`${bebasNeue.className} w-full inline-flex items-center justify-center gap-2 font-bold text-3xl md:text-5xl hover:bg-black hover:text-white uppercase px-6 py-6 md:py-12 border-2 rounded-full transition-all duration-300 text-black border-black bg-white shadow-lg shadow-gray-400`}
            >
              {t("readTheBlog.readBlogButton")}
            </button>
          </p>

          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
