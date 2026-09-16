"use client";

import { useEffect, useState } from "react";

export type PerformanceTier = "low" | "standard" | "high";

type NavigatorWithCapabilities = Navigator & {
  connection?: EventTarget & {
    saveData?: boolean;
    effectiveType?: string;
  };
  deviceMemory?: number;
};

function detectPerformanceTier(): PerformanceTier {
  const capabilities = navigator as NavigatorWithCapabilities;
  const connection = capabilities.connection;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const lowBandwidth =
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "3g";

  if (
    reducedMotion ||
    connection?.saveData ||
    (capabilities.deviceMemory !== undefined &&
      capabilities.deviceMemory <= 4) ||
    (navigator.hardwareConcurrency !== undefined &&
      navigator.hardwareConcurrency <= 4)
  ) {
    return "low";
  }

  if (
    lowBandwidth ||
    (capabilities.deviceMemory !== undefined &&
      capabilities.deviceMemory < 8) ||
    (navigator.hardwareConcurrency !== undefined &&
      navigator.hardwareConcurrency < 8)
  ) {
    return "standard";
  }

  return "high";
}

export function usePerformanceTier() {
  const [tier, setTier] = useState<PerformanceTier>("standard");

  useEffect(() => {
    const capabilities = navigator as NavigatorWithCapabilities;
    const connection = capabilities.connection;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateTier = () => setTier(detectPerformanceTier());

    updateTier();
    motion.addEventListener("change", updateTier);
    connection?.addEventListener("change", updateTier);

    return () => {
      motion.removeEventListener("change", updateTier);
      connection?.removeEventListener("change", updateTier);
    };
  }, []);

  return tier;
}
