import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const checkIsMobile = () => {
    // Check screen width
    const isSmallScreen = window.innerWidth < MOBILE_BREAKPOINT;

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
    return isSmallScreen || (hasTouchScreen && isMobileUserAgent);
  };

  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    checkIsMobile()
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(checkIsMobile());
    };

    mql.addEventListener("change", onChange);
    setIsMobile(checkIsMobile());

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
