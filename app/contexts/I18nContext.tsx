"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  messages as allMessages,
  SupportedLocale,
  NestedMessages,
} from "@/app/locales";

export type I18nContextValue = {
  locale: SupportedLocale;
  setLocale: (next: SupportedLocale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const DEFAULT_LOCALE: SupportedLocale = "pt";
const STORAGE_KEY = "locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);

  useEffect(() => {
    // Load preferred locale from localStorage or browser
    const stored =
      typeof window !== "undefined"
        ? (localStorage.getItem(STORAGE_KEY) as SupportedLocale | null)
        : null;
    if (stored === "pt" || stored === "en") {
      setLocaleState(stored);
      return;
    }
    const nav = typeof window !== "undefined" ? navigator.language : undefined;
    if (nav?.toLowerCase().startsWith("en")) setLocaleState("en");
    else setLocaleState(DEFAULT_LOCALE);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, locale);
      // Reflect on <html lang>
      document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
    }
  }, [locale]);

  const msgs = allMessages[locale];

  const t = useCallback(
    (key: string) => {
      // Deep lookup using dot notation
      const parts = key.split(".");
      let cur: NestedMessages | string = msgs as NestedMessages;
      for (const part of parts) {
        if (cur && typeof cur === "object" && part in cur) {
          cur = (cur as NestedMessages)[part] as NestedMessages | string;
        } else {
          return key; // fallback to key
        }
      }
      return typeof cur === "string" ? cur : key;
    },
    [msgs]
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale: setLocaleState, t }),
    [locale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
