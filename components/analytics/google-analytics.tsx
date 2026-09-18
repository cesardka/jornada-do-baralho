"use client";

import { useEffect } from "react";
import Script from "next/script";

const GOOGLE_ANALYTICS_ID = "G-EKW4K5RXWG";

type AnalyticsValue = string | number | boolean;
export type AnalyticsParams = Record<string, AnalyticsValue>;
type GtagEvent = (
  command: "event",
  eventName: string,
  params?: AnalyticsParams,
) => void;
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: GtagEvent;
};

export function trackEvent(eventName: string, params?: AnalyticsParams) {
  if (typeof window === "undefined") return;

  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.dataLayer ??= [];
  analyticsWindow.gtag ??= (...args) => {
    analyticsWindow.dataLayer?.push(args);
  };
  analyticsWindow.gtag("event", eventName, params);
}

function getLinkText(link: HTMLAnchorElement) {
  return (
    link.getAttribute("aria-label") ??
    link.textContent?.replace(/\s+/g, " ").trim() ??
    link.title ??
    ""
  ).slice(0, 100);
}

function LinkClickTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("javascript:")) return;

      let url: URL;
      try {
        url = new URL(link.href, window.location.href);
      } catch {
        return;
      }

      const sourceElement = link.closest<HTMLElement>(
        "[data-analytics-section], [id], nav, footer",
      );
      const sourceSection =
        link.dataset.analyticsSource ??
        sourceElement?.dataset.analyticsSection ??
        sourceElement?.id ??
        sourceElement?.tagName.toLowerCase() ??
        "unknown";
      const external = url.origin !== window.location.origin;
      const params: AnalyticsParams = {
        link_url: external
          ? url.href
          : `${url.pathname}${url.search}${url.hash}`,
        link_text: getLinkText(link),
        link_domain: url.hostname,
        link_type: external ? "outbound" : "internal",
        source_path: `${window.location.pathname}${window.location.search}`,
        source_section: sourceSection,
      };

      trackEvent(external ? "outbound_link_click" : "navigation_click", params);

      const customEvent = link.dataset.analyticsEvent;
      if (customEvent) {
        trackEvent(customEvent, {
          ...params,
          ...(link.dataset.analyticsContentId
            ? { content_id: link.dataset.analyticsContentId }
            : {}),
        });
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ANALYTICS_ID}');
        `}
      </Script>
      <LinkClickTracker />
    </>
  );
}
