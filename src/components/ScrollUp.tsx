
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const SCROLL_THRESHOLD = 320;

const ScrollUp = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Back to top"
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      className={[
        "fixed bottom-24 right-6 z-[60] flex h-12 w-12 items-center justify-center",
        "rounded-full border border-[#e6c58a]/50 bg-[#26372a] text-[#f3d49e]",
        "shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition-all duration-300",
        "hover:-translate-y-1 hover:bg-[#344b38] hover:shadow-[0_12px_28px_rgba(0,0,0,0.28)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6a85f] focus-visible:ring-offset-2",
        "md:bottom-24 md:right-7",
        "motion-reduce:transition-none",
        isVisible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-4 scale-90 opacity-0",
      ].join(" ")}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.2} />
    </button>
  );
};

export default ScrollUp;
