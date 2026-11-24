
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Seo } from "@/components/Seo";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Images,
  X,
} from "lucide-react";

type Img = {
  id: string;
  image_url: string;
  caption: string | null;
  category: string | null;
};

const SITE_URL = "https://karembotours.co.ke";
const HERO = "/gallery/wildebeest-herd-mara.jpg";

const absoluteUrl = (url: string) =>
  url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;

const Gallery = () => {
  const [rows, setRows] = useState<Img[]>([]);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<Img | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchImages = async () => {
      setLoading(true);
      setError(false);

      const { data, error: fetchError } = await supabase
        .from("gallery_images")
        .select("id, image_url, caption, category")
        .order("sort_order", { ascending: true });

      if (!active) return;

      if (fetchError) {
        setError(true);
        setRows([]);
      } else {
        setRows((data as Img[]) ?? []);
      }

      setLoading(false);
    };

    fetchImages();

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(rows.map((image) => image.category || "Other"))
      ),
    ],
    [rows]
  );

  const visible = useMemo(
    () =>
      filter === "All"
        ? rows
        : rows.filter((image) => (image.category || "Other") === filter),
    [filter, rows]
  );

  const currentIndex = open
    ? visible.findIndex((image) => image.id === open.id)
    : -1;

  const openImage = (image: Img) => setOpen(image);

  const closeImage = () => setOpen(null);

  const showNext = () => {
    if (currentIndex < 0 || visible.length < 2) return;
    setOpen(visible[(currentIndex + 1) % visible.length]);
  };

  const showPrevious = () => {
    if (currentIndex < 0 || visible.length < 2) return;
    setOpen(
      visible[(currentIndex - 1 + visible.length) % visible.length]
    );
  };

  // Lightbox keyboard controls and scroll locking.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeImage();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrevious();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, currentIndex, visible]);

  const imageSchema = visible.slice(0, 40).map((image, index) => ({
    "@type": "ImageObject",
    contentUrl: absoluteUrl(image.image_url),
    name:
      image.caption ||
      `${image.category || "Kenya safari"} photograph ${index + 1}`,
    description:
      image.caption ||
      `A photograph from the Karembo Tours Kenya travel gallery.`,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Kenya Safari and Wildlife Photo Gallery",
    description:
      "Explore safari photography, wildlife, landscapes and travel experiences from Kenya.",
    url: `${SITE_URL}/gallery`,
    image: imageSchema,
    isPartOf: {
      "@type": "WebSite",
      name: "Karembo Tours",
      url: SITE_URL,
    },
  };

  return (
    <>
      <Seo
        title="Kenya Safari Photo Gallery | Wildlife & Landscapes | Karembo Tours"
        description="Explore our Kenya safari photo gallery featuring wildlife, the Maasai Mara, African landscapes and memorable moments from Karembo Tours adventures."
        path="/gallery"
        image={HERO}
        type="website"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="relative min-h-[72vh] overflow-hidden bg-[#10271e] text-white">
        <div className="absolute inset-0">
          <img
            src={HERO}
            alt="A herd of wildebeest moving across the Maasai Mara in Kenya"
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#091b14]/90 via-[#10271e]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10271e]/70 via-transparent to-black/10" />
        </div>

        <div className="container-edge relative z-10 flex min-h-[72vh] items-end pb-20 pt-36 md:pb-28">
          <div className="max-w-3xl">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-[#c6a66b]" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e3c995]">
                Through the lens
              </span>
            </div>

            <h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
              Kenya, in
              <br />
              <span className="italic text-[#d6bd8e]">every frame.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-white/80 md:text-lg">
              From the drama of the wild to the quiet beauty of the
              landscape, discover the moments that make Kenya unforgettable.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <a
                href="#collection"
                className="inline-flex items-center gap-3 bg-[#c6a66b] px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-[#14251d] transition hover:bg-[#ddc18a]"
              >
                Explore the gallery
                <ArrowDown size={16} />
              </a>

              <div className="flex items-center gap-2 text-sm text-white/70">
                <Camera size={17} />
                <span>Stories from the wild</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 hidden h-32 w-32 border-l border-t border-white/20 md:block" />
      </section>

      {/* Gallery introduction */}
      <section className="bg-[#f7f5ef] py-16 md:py-24">
        <div className="container-edge">
          <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-end">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-9 bg-[#b7975d]" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d754d]">
                  The Karembo collection
                </span>
              </div>

              <h2 className="max-w-xl font-serif text-4xl leading-tight text-[#18372a] md:text-5xl lg:text-6xl">
                More than places.
                <br />
                <span className="italic text-[#a78a59]">
                  Moments worth keeping.
                </span>
              </h2>
            </div>

            <div className="max-w-xl md:justify-self-end">
              <p className="text-base leading-8 text-[#657168]">
                Every journey tells a different story. Browse the wildlife,
                scenery and experiences that make exploring Kenya so special.
                These are glimpses of the world waiting beyond the ordinary.
              </p>

              <div className="mt-6 flex items-center gap-3 text-sm font-medium text-[#18372a]">
                <Images size={18} className="text-[#a78a59]" />
                <span>
                  {loading
                    ? "Loading photographs..."
                    : `${rows.length} photographs in our collection`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery collection */}
      <section
        id="collection"
        className="scroll-mt-20 bg-[#f7f5ef] pb-24 md:pb-32"
      >
        <div className="container-edge">
          <div className="mb-10 border-b border-[#dedbd1] pb-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#a18453]">
                  Browse the photographs
                </p>
                <h2 className="font-serif text-3xl text-[#18372a] md:text-4xl">
                  The gallery
                </h2>
              </div>

              {!loading && !error && (
                <p className="text-sm text-[#788078]">
                  Showing {visible.length}{" "}
                  {visible.length === 1 ? "photograph" : "photographs"}
                </p>
              )}
            </div>

            {/* Category filters */}
            {!loading && !error && rows.length > 0 && (
              <div
                className="mt-7 flex flex-wrap gap-2"
                aria-label="Filter gallery by category"
              >
                {categories.map((category) => {
                  const active = filter === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setFilter(category);
                        setOpen(null);
                      }}
                      aria-pressed={active}
                      className={cn(
                        "rounded-full border px-5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300",
                        active
                          ? "border-[#18372a] bg-[#18372a] text-white"
                          : "border-[#d9d6cb] bg-transparent text-[#59665c] hover:border-[#18372a] hover:text-[#18372a]"
                      )}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "mb-4 break-inside-avoid animate-pulse bg-[#e9e6dc]",
                    index % 3 === 0 ? "h-72" : index % 3 === 1 ? "h-52" : "h-64"
                  )}
                />
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="py-24 text-center">
              <Camera
                size={36}
                className="mx-auto mb-5 text-[#a18453]"
              />
              <h3 className="font-serif text-2xl text-[#18372a]">
                The photographs couldn't load.
              </h3>
              <p className="mt-3 text-sm text-[#788078]">
                Please refresh the page and try again.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-7 border border-[#18372a] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#18372a] transition hover:bg-[#18372a] hover:text-white"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && rows.length === 0 && (
            <div className="py-24 text-center">
              <Images
                size={38}
                className="mx-auto mb-5 text-[#a18453]"
              />
              <h3 className="font-serif text-2xl text-[#18372a]">
                The collection is growing.
              </h3>
              <p className="mt-3 text-sm text-[#788078]">
                Our photographs will be here soon.
              </p>
            </div>
          )}

          {!loading && !error && rows.length > 0 && visible.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-serif text-2xl text-[#18372a]">
                No photographs in this category yet.
              </p>
              <button
                type="button"
                onClick={() => setFilter("All")}
                className="mt-5 text-sm font-semibold text-[#a18453] underline underline-offset-4"
              >
                View all photographs
              </button>
            </div>
          )}

          {/* Masonry image grid */}
          {!loading && !error && visible.length > 0 && (
            <div className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
              {visible.map((img, index) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => openImage(img)}
                  aria-label={`View photograph: ${
                    img.caption || img.category || "Kenya safari"
                  }`}
                  className="group relative mb-3 block w-full break-inside-avoid overflow-hidden bg-[#e7e4da] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a18453] focus-visible:ring-offset-4 md:mb-4"
                >
                  <img
                    src={img.image_url}
                    alt={
                      img.caption ||
                      `${img.category || "Kenya safari"} photograph from Karembo Tours`
                    }
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full transition duration-700 ease-out group-hover:scale-[1.045]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1e15]/85 via-transparent to-transparent opacity-70 transition duration-500 group-hover:opacity-100" />

                  <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between gap-3 p-3 opacity-100 transition duration-500 group-hover:translate-y-0 md:p-5">
                    <div className="min-w-0">
                      {img.category && (
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#ddc18a] md:text-[10px]">
                          {img.category}
                        </p>
                      )}

                      {img.caption && (
                        <p className="line-clamp-2 text-xs font-medium leading-relaxed text-white md:text-sm">
                          {img.caption}
                        </p>
                      )}
                    </div>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition group-hover:border-[#c6a66b] group-hover:bg-[#c6a66b] group-hover:text-[#14251d]">
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Closing section */}
      <section className="relative overflow-hidden bg-[#142d21] py-20 text-white md:py-28">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -right-8 -top-12 h-56 w-56 rounded-full border border-white/10" />

        <div className="container-edge relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d2b77e]">
              Your story starts here
            </span>

            <h2 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
              Some moments are
              <br />
              <span className="italic text-[#d2b77e]">
                better experienced.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-white/65 md:text-base">
              The photographs offer a glimpse. A journey through Kenya lets
              you experience the landscapes, wildlife and unforgettable
              moments for yourself.
            </p>

            <a
              href="/safaris"
              className="mt-9 inline-flex items-center gap-4 bg-[#c6a66b] px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-[#14251d] transition hover:bg-[#ddc18a]"
            >
              Discover our safaris
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Image lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07130e]/95 p-4 backdrop-blur-sm md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          onClick={closeImage}
        >
          <button
            type="button"
            onClick={closeImage}
            aria-label="Close image viewer"
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-[#c6a66b] hover:bg-[#c6a66b] hover:text-[#14251d] md:right-8 md:top-8"
          >
            <X size={21} />
          </button>

          {visible.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevious();
                }}
                aria-label="Previous photograph"
                className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-[#c6a66b] hover:bg-[#c6a66b] hover:text-[#14251d] md:left-8 md:h-12 md:w-12"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                aria-label="Next photograph"
                className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-[#c6a66b] hover:bg-[#c6a66b] hover:text-[#14251d] md:right-8 md:h-12 md:w-12"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div
            className="relative flex max-h-full w-full max-w-6xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={open.image_url}
              alt={
                open.caption ||
                `${open.category || "Kenya safari"} photograph from Karembo Tours`
              }
              className="max-h-[76vh] max-w-full rounded-sm object-contain shadow-2xl"
            />

            <div className="mt-5 flex w-full max-w-4xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
              <div>
                {open.category && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#d2b77e]">
                    {open.category}
                  </p>
                )}
                {open.caption && (
                  <p className="mt-1 text-sm text-white/85">
                    {open.caption}
                  </p>
                )}
              </div>

              {visible.length > 1 && (
                <p className="shrink-0 text-xs tabular-nums text-white/50">
                  {currentIndex + 1} / {visible.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
