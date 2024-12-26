import { useState, useEffect } from "react";

export const useScreenWidth = () => {
  const [isMobile, setIsMobile] = useState(false);

  const MOBILE_BREAKPOINT = 1024;

  const handleResize = () => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
  };

  useEffect(() => {
    // Check on initial render
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};
