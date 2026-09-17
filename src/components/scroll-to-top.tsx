import { useEffect } from "react";
import { useLocation } from "wouter";

/** Reset scroll position on client-side navigation. */
export function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location]);
  return null;
}
