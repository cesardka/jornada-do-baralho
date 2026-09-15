"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Images, Menu, X } from "lucide-react";
import { useI18n } from "@/app/contexts/I18nContext";
import styles from "./v2-nav.module.css";

const sectionLinks = [
  { href: "#countdown", label: "v2.nav.countdown" },
  { href: "#deck", label: "v2.nav.deck" },
  { href: "#challenge", label: "v2.nav.challenge" },
  { href: "#signed-cards", label: "v2.nav.signedCards" },
  { href: "#journey", label: "v2.nav.journey" },
  { href: "#blog-section", label: "v2.nav.blogSection" },
  { href: "#credits", label: "v2.nav.credits" },
] as const;

const navLinkClass = `${styles.adaptiveControl} rounded px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`;

export default function V2Nav() {
  const { t, locale, setLocale } = useI18n();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia(
      "(min-width: 1200px) and (hover: hover) and (pointer: fine)",
    );
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      dialogRef.current?.close();
    };

    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => {
      desktopQuery.removeEventListener("change", closeOnDesktop);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const openMenu = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    delete dialog.dataset.closing;
    dialog.showModal();
    setIsOpen(true);
    closeButtonRef.current?.focus();
  };

  const closeMenu = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open || dialog.dataset.closing) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.close();
      return;
    }

    dialog.dataset.closing = "true";
    closeTimerRef.current = setTimeout(() => dialog.close(), 320);
  };

  const toggleLocale = () => {
    setLocale(locale === "pt" ? "en" : "pt");
  };

  return (
    <header className={styles.header}>
      <nav
        aria-label={t("v2.nav.primary")}
        className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/v2"
          aria-label={t("v2.nav.home")}
          className={`${styles.adaptiveControl} rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`}
        >
          <Image
            width={100}
            height={50}
            src="/images/jornada-do-baralho.png"
            alt=""
            className={styles.logo}
            priority
          />
        </Link>

        <div className={`${styles.desktopNav} items-center gap-1`}>
          <Link
            href="/galeria"
            className={`${navLinkClass} flex items-center gap-2`}
          >
            <Images aria-hidden="true" size={18} />
            {t("v2.nav.gallery")}
          </Link>
          <Link
            href="/blog"
            className={`${navLinkClass} flex items-center gap-2`}
          >
            <BookOpen aria-hidden="true" size={18} />
            {t("v2.nav.blog")}
          </Link>
          <button
            type="button"
            aria-label={t("nav.lang_label")}
            onClick={toggleLocale}
            className={navLinkClass}
          >
            {locale === "pt" ? t("nav.lang_pt") : t("nav.lang_en")}
          </button>
        </div>

        <button
          type="button"
          aria-label={t("v2.nav.openMenu")}
          aria-expanded={isOpen}
          aria-controls="v2-navigation-dialog"
          onClick={openMenu}
          className={`${styles.menuButton} ${styles.adaptiveControl} min-h-11 min-w-11 items-center justify-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
        >
          <Menu aria-hidden="true" size={30} />
        </button>
      </nav>

      <dialog
        ref={dialogRef}
        id="v2-navigation-dialog"
        aria-labelledby="v2-navigation-title"
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onClose={() => {
          if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
          closeTimerRef.current = null;
          delete dialogRef.current?.dataset.closing;
          setIsOpen(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
        className={`${styles.dialog} m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-[#016745] p-0 text-white open:flex`}
      >
        <div
          className={`${styles.dialogPanel} flex h-full w-full flex-col px-6 pb-8 pt-5`}
        >
          <div className="flex items-center justify-between border-b border-white/25 pb-5">
            <h2 id="v2-navigation-title" className="text-xl font-bold">
              {t("v2.nav.menuTitle")}
            </h2>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label={t("v2.nav.closeMenu")}
              onClick={closeMenu}
              className={`${styles.mobileClose} flex min-h-11 min-w-11 items-center justify-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
            >
              <X aria-hidden="true" size={30} />
            </button>
          </div>

          <ul
            className={`${styles.mobileSections} flex flex-1 flex-col justify-center gap-2`}
          >
            {sectionLinks.map((link) => (
              <li key={link.href}>
                <Link
                  data-mobile-menu-option
                  href={link.href}
                  onClick={closeMenu}
                  className={`${styles.mobileSectionLink} block rounded px-4 py-3 text-2xl font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
                >
                  {t(link.label)}
                </Link>
              </li>
            ))}
          </ul>

          <div
            className={`${styles.mobileUtilities} grid grid-cols-2 gap-3 border-t border-white/25 pt-5`}
          >
            <Link
              href="/galeria"
              onClick={closeMenu}
              className={`${styles.mobileUtility} flex min-h-11 items-center justify-center gap-2 rounded border border-white/40 px-3 py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
            >
              <Images aria-hidden="true" size={19} />
              {t("v2.nav.gallery")}
            </Link>
            <Link
              href="/blog"
              onClick={closeMenu}
              className={`${styles.mobileUtility} flex min-h-11 items-center justify-center gap-2 rounded border border-white/40 px-3 py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
            >
              <BookOpen aria-hidden="true" size={19} />
              {t("v2.nav.blog")}
            </Link>
            <button
              type="button"
              aria-label={t("nav.lang_label")}
              onClick={toggleLocale}
              className={`${styles.mobileUtility} col-span-2 min-h-11 rounded border border-white/40 px-3 py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
            >
              {locale === "pt" ? t("nav.lang_pt") : t("nav.lang_en")}
            </button>
          </div>
        </div>
      </dialog>
    </header>
  );
}
