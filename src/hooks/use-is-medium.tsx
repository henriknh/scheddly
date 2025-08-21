import * as React from "react";

const MEDIUM_BREAKPOINT = 1024;

export function useIsMedium(): boolean {
  const checkIsMedium = () => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      // Default to false during SSR
      return false;
    }

    // Check screen width
    const isMediumScreen = window.innerWidth < MEDIUM_BREAKPOINT;

    // Check for touch capabilities
    const hasTouchScreen =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // Check user agent for mobile devices
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUserAgent =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      );

    // Consider it mobile if any of these conditions are true
    return isMediumScreen || (hasTouchScreen && isMobileUserAgent);
  };

  const [isMedium, setIsMedium] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Set initial value
    setIsMedium(checkIsMedium());

    const mql = window.matchMedia(`(max-width: ${MEDIUM_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMedium(checkIsMedium());
    };

    mql.addEventListener("change", onChange);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMedium;
}
