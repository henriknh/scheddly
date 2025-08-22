"use client";

import { useMemo } from "react";
import { useIsMobile } from "./use-is-mobile";
import { useIsTablet } from "./use-is-tablet";

export type ScreenSize = "mobile" | "tablet" | "desktop";

export function useScreenSize(): ScreenSize {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  return useMemo((): ScreenSize => {
    if (isMobile) {
      return "mobile";
    } else if (isTablet) {
      return "tablet";
    } else {
      return "desktop";
    }
  }, [isMobile, isTablet]);
}
