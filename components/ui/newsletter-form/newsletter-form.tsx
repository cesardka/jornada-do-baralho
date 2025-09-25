"use client";

import { useI18n } from "@/app/contexts/I18nContext";

export default function NewsletterForm({ label }: { label?: string }) {
  const { t } = useI18n();

  return (
    <form
      action="https://buttondown.com/api/emails/embed-subscribe/jornadadobaralho"
      method="post"
      target="popupwindow"
      onSubmit={() =>
        window.open("https://buttondown.com/jornadadobaralho", "popupwindow")
      }
      className="embeddable-buttondown-form flex flex-col items-center justify-center space-y-2 mt-2 text-center text-sm"
    >
      <div className="flex flex-row w-full sm:w-1/3 space-x-0">
        <input
          type="email"
          name="email"
          id="bd-email"
          className="text-sm w-full h-10 bg-white border-0 inset-1 rounded-r-none border-gray-500 rounded-md px-4 py-2 mx-0 shadow-sm shadow-gray-400"
          // placeholder={t("readTheBlog.newsletterInput")}
          placeholder={label ? label : t("readTheBlog.newsletterLabel")}
        />

        <input
          type="submit"
          className="text-sm h-10 flex items-center justify-center border-0 rounded-md border-l-0 rounded-l-none bg-blue-500 hover:bg-blue-600 duration-300 text-white w-1/3 px-4 py-2 my-0 shadow-sm shadow-gray-400 cursor-pointer"
          value={t("readTheBlog.newsletterSend")}
        />
      </div>

      <div className="flex flex-col">
        <a
          href="https://buttondown.com/refer/jornadadobaralho"
          target="_blank"
          className="text-xs"
        >
          Powered by Buttondown.
        </a>
      </div>
    </form>
  );
}
