import { useEffect, useState } from "react";

const SESSION_KEY = "lead_popup_shown";

/**
 * Triggers when the user moves the mouse out the top of the viewport (desktop)
 * or after `mobileDelayMs` AND a noticeable scroll-up gesture (mobile fallback).
 * Fires only once per session.
 */
export const useExitIntent = (mobileDelayMs = 45000) => {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    let lastY = window.scrollY;
    let mobileTimer: number | undefined;
    let armed = false;

    const fire = () => {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
      setTriggered(true);
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) fire();
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (armed && lastY - y > 40) fire();
      lastY = y;
    };

    const isTouch = window.matchMedia("(hover: none)").matches;

    if (isTouch) {
      mobileTimer = window.setTimeout(() => { armed = true; }, mobileDelayMs);
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      document.addEventListener("mouseleave", onMouseLeave);
    }

    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
      if (mobileTimer) window.clearTimeout(mobileTimer);
    };
  }, [mobileDelayMs]);

  return { triggered, dismiss: () => setTriggered(false) };
};
