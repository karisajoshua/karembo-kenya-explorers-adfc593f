import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  image?: string;
  images?: string[];
  eyebrow?: string;
  title: string;
  subtitle?: string;
  size?: "default" | "tall";
  children?: React.ReactNode;
  interval?: number;
};

export const PageHero = ({
  image,
  images,
  eyebrow,
  title,
  subtitle,
  size = "default",
  children,
  interval = 5000,
}: Props) => {
  const slides = images && images.length > 0 ? images : image ? [image] : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [slides.length, interval]);

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden",
        size === "tall" ? "min-h-[88vh]" : "min-h-[55vh] md:min-h-[60vh]"
      )}
    >
      {slides.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out",
            i === index ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="relative container-edge h-full flex items-end md:items-center pb-16 md:pb-0 pt-32 md:pt-24 min-h-inherit">
        <div className="max-w-2xl text-primary-foreground">
          {eyebrow && (
            <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-accent mb-4 animate-fade-up">
              {eyebrow}
            </p>
          )}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-balance animate-fade-up">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/90 leading-relaxed max-w-xl animate-fade-up">
              {subtitle}
            </p>
          )}
          {children && <div className="mt-8 flex flex-wrap gap-4 animate-fade-up">{children}</div>}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-8 bg-accent" : "w-4 bg-primary-foreground/50 hover:bg-primary-foreground/80"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
};
