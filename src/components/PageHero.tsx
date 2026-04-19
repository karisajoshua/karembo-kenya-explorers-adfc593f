import { cn } from "@/lib/utils";

type Props = {
  image: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  size?: "default" | "tall";
  children?: React.ReactNode;
};

export const PageHero = ({ image, eyebrow, title, subtitle, size = "default", children }: Props) => (
  <section
    className={cn(
      "relative w-full overflow-hidden",
      size === "tall" ? "min-h-[88vh]" : "min-h-[55vh] md:min-h-[60vh]"
    )}
  >
    <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
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
  </section>
);
