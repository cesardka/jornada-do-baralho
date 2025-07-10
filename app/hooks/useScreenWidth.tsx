import { useState, useEffect } from "react";

export const useScreenWidth = () => {
  const [isMobile, setIsMobile] = useState(false);

  const MOBILE_BREAKPOINT = 1024;

  const handleResize = () => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};
