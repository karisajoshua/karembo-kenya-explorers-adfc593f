import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export const SectionHeader = ({ eyebrow, title, subtitle, align = "center", className }: Props) => (
  <div
    className={cn(
      "max-w-3xl mb-12",
      align === "center" ? "mx-auto text-center" : "text-left",
      className
    )}
  >
    {eyebrow && (
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent mb-3">{eyebrow}</p>
    )}
    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-primary text-balance">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">{subtitle}</p>
    )}
  </div>
);
