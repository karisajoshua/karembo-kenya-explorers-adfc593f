import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PackageCardItem } from "@/components/PackageCard";

export const usePackagesByCategory = (category: string) => {
  const [items, setItems] = useState<PackageCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("packages")
      .select("slug,title,image,duration,price_from,price_private,min_guests,summary")
      .eq("published", true)
      .eq("category", category)
      .order("sort_order")
      .then(({ data }) => {
        if (!active) return;
        setItems((data as PackageCardItem[]) ?? []);
        setLoading(false);
      });
    return () => { active = false; };
  }, [category]);

  return { items, loading };
};
