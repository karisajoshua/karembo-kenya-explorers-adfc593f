import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/PageHero";
import { cn } from "@/lib/utils";

type Img = { id: string; image_url: string; caption: string | null; category: string | null };

const HERO = "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2000&q=80";

const Gallery = () => {
  const [rows, setRows] = useState<Img[]>([]);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<Img | null>(null);

  useEffect(() => {
    supabase.from("gallery_images").select("*").order("sort_order")
      .then(({ data }) => setRows((data as Img[]) ?? []));
  }, []);

  const cats = useMemo(() => ["All", ...Array.from(new Set(rows.map((r) => r.category || "Other")))], [rows]);
  const visible = filter === "All" ? rows : rows.filter((r) => (r.category || "Other") === filter);

  return (
    <>
      <PageHero image={HERO} eyebrow="Through the lens" title="Gallery" subtitle="A glimpse of Kenya through our cameras — wildlife, landscapes, and the people who make every safari unforgettable." />
      <section className="py-16">
        <div className="container-edge">
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {cats.map((c) => (
              <button key={c} onClick={() => setFilter(c)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition",
                  filter === c ? "bg-accent text-accent-foreground" : "bg-sand text-primary hover:bg-sand/70"
                )}>
                {c}
              </button>
            ))}
          </div>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {visible.map((img) => (
              <button
                key={img.id}
                onClick={() => setOpen(img)}
                className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg"
              >
                <img
                  src={img.image_url}
                  alt={img.caption || ""}
                  loading="lazy"
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
                />
                {img.caption && (
                  <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-primary/90 via-primary/20 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                    <p className="text-left text-sm font-medium text-primary-foreground">{img.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>
      {open && (
        <div onClick={() => setOpen(null)} className="fixed inset-0 z-50 bg-primary/95 flex items-center justify-center p-6 cursor-zoom-out">
          <div className="max-w-5xl w-full">
            <img src={open.image_url} alt={open.caption || ""} className="max-h-[80vh] w-auto mx-auto rounded-lg" />
            {open.caption && <p className="text-center text-primary-foreground/90 mt-4">{open.caption}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
