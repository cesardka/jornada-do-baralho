"use client";

import { useI18n } from "@/app/contexts/I18nContext";

export default function NewsletterForm({
  label,
  header,
}: {
  label?: string;
  header?: boolean;
}) {
  const { t } = useI18n();

  // TODO: make sure the newsletter is working as expected
  // return (
  //   <div className="flex flex-col items-center justify-center bg-none">
  //     <iframe
  //       src="https://cesardka.substack.com/embed"
  //       width="500"
  //       height="300"
  //       style={{ border: "1px solid #EEE" }}
  //     ></iframe>
  //   </div>
  // );

  return (
    <>
      {header && (
        <p className="text-sm font-bold">
          {t("readTheBlog.newsletterHeader")}
        </p>
      )}

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
            className="text-sm w-full h-10 bg-red-200 border-0 inset-1 rounded-r-none border-gray-500 rounded-tl-none rounded-md px-4 py-2 mx-0 shadow-sm border-b-2 border-b-red-300 shadow-gray-400 text-red-900 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-red-400 focus:ring-opacity-50"
            placeholder={label ? label : t("readTheBlog.newsletterLabel")}
          />

          <input
            type="submit"
            className="text-sm h-10 flex items-center justify-center border-0 rounded-md border-l-0 rounded-l-none rounded-br-none bg-blue-600 hover:bg-blue-800 border-r-4 border-b-2 hover:border-b-blue-900 hover:border-blue-600 border-b-blue-700 border-blue-400 duration-300 text-white w-1/3 px-4 py-2 my-0 shadow-sm shadow-gray-400 cursor-pointer"
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
    </>
  );
}
