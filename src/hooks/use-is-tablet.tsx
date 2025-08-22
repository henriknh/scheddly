import * as React from "react";

const TABLET_BREAKPOINT = 1024;

export function useIsTablet(): boolean {
  const checkIsTablet = () => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      // Default to false during SSR
      return false;
    }

    // Check screen width
    const isTabletScreen = window.innerWidth < TABLET_BREAKPOINT;

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
    return isTabletScreen || (hasTouchScreen && isMobileUserAgent);
  };

  const [isTablet, setIsTablet] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Set initial value
    setIsTablet(checkIsTablet());

    const mql = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsTablet(checkIsTablet());
    };

    mql.addEventListener("change", onChange);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isTablet;
}
