import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const STORE_KEY = "category_views";
const SUGGEST_SHOWN = "category_suggest_shown";
const THRESHOLD = 3;

const routeToCategory = (path: string): string | null => {
  if (path.startsWith("/safaris")) return "safari";
  if (path.startsWith("/day-trips")) return "day-trip";
  if (path.startsWith("/combo")) return "combo";
  if (path.startsWith("/cultural")) return "cultural";
  return null;
};

const labelFor = (cat: string) => {
  switch (cat) {
    case "safari": return "Masai Mara Safaris";
    case "day-trip": return "Nairobi Day Trips";
    case "combo": return "Combo Safaris";
    case "cultural": return "Cultural Experiences";
    default: return "Tours";
  }
};

/**
 * Tracks how many pages the user has visited per category.
 * When threshold reached for one category, returns a suggestion (once per session).
 */
export const useCategoryTracker = () => {
  const location = useLocation();
  const [suggest, setSuggest] = useState<{ category: string; label: string } | null>(null);

  useEffect(() => {
    const cat = routeToCategory(location.pathname);
    if (!cat) return;
    const raw = sessionStorage.getItem(STORE_KEY);
    const counts: Record<string, number> = raw ? JSON.parse(raw) : {};
    counts[cat] = (counts[cat] ?? 0) + 1;
    sessionStorage.setItem(STORE_KEY, JSON.stringify(counts));

    if (sessionStorage.getItem(SUGGEST_SHOWN)) return;

    if (counts[cat] >= THRESHOLD) {
      // small delay so it doesn't pop instantly on nav
      const t = window.setTimeout(() => {
        if (sessionStorage.getItem(SUGGEST_SHOWN)) return;
        sessionStorage.setItem(SUGGEST_SHOWN, "1");
        setSuggest({ category: cat, label: labelFor(cat) });
      }, 6000);
      return () => window.clearTimeout(t);
    }
  }, [location.pathname]);

  return { suggest, dismiss: () => setSuggest(null) };
};
