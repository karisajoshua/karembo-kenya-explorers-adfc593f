
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock3,
} from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Seo } from "@/components/Seo";

type Post = {
  id: string;
  slug: string;
  title: string;
  content: string;
  cover_image: string | null;
  created_at: string;
  author: string | null;
  excerpt?: string | null;
};

const SITE_URL = "https://karembotours.co.ke";
const FALLBACK_IMAGE = "/gallery/wildebeest-crossing.jpg";

const absoluteUrl = (value: string) =>
  value.startsWith("http")
    ? value
    : `${SITE_URL}${value.startsWith("/") ? "" : "/"}${value}`;

const formatPostDate = (value: string) => {
  const date = parseISO(value);
  return isValid(date) ? format(date, "dd MMMM yyyy") : "";
};

const isSafeHref = (href: string) =>
  /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(href.trim());

const renderInline = (
  value: string,
  keyPrefix: string
): ReactNode[] => {
  const tokenPattern =
    /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

  const parts = value.split(tokenPattern);

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong
          key={key}
          className="font-semibold text-[#183c32]"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }

    const linkMatch = part.match(
      /^\[([^\]]+)\]\(([^)]+)\)$/
    );

    if (linkMatch) {
      const [, label, href] = linkMatch;

      if (!isSafeHref(href)) return label;

      const external = /^https?:\/\//i.test(href);

      return (
        <a
          key={key}
          href={href}
          className="font-medium text-[#a17e3e] underline decoration-[#d6bd7b] underline-offset-4 transition hover:text-[#183c32]"
          {...(external
            ? {
                target: "_blank",
                rel: "noopener noreferrer",
              }
            : {})}
        >
          {label}
        </a>
      );
    }

    return part;
  });
};

const renderContent = (markdown: string): ReactNode[] => {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];

  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    // Markdown images
    const imageMatch = trimmed.match(
      /^!\[([^\]]*)\]\(([^)]+)\)$/
    );

    if (imageMatch) {
      const [, alt, src] = imageMatch;

      if (isSafeHref(src)) {
        blocks.push(
          <figure
            key={`image-${index}`}
            className="my-10"
          >
            <img
              src={src}
              alt={alt || "Illustration for this journal article"}
              loading="lazy"
              decoding="async"
              className="max-h-[620px] w-full rounded-2xl object-cover shadow-[0_16px_45px_rgba(24,60,50,0.12)]"
            />

            {alt && (
              <figcaption className="mt-3 text-center text-xs leading-6 text-[#7a857c]">
                {alt}
              </figcaption>
            )}
          </figure>
        );
      }

      index += 1;
      continue;
    }

    // H3
    if (trimmed.startsWith("### ")) {
      blocks.push(
        <h3
          key={`h3-${index}`}
          className="mb-4 mt-9 font-serif text-2xl leading-snug text-[#254b3e] md:text-3xl"
        >
          {renderInline(trimmed.slice(4), `h3-${index}`)}
        </h3>
      );

      index += 1;
      continue;
    }

    // H2
    if (trimmed.startsWith("## ")) {
      blocks.push(
        <h2
          key={`h2-${index}`}
          className="mb-5 mt-12 font-serif text-3xl leading-tight text-[#183c32] md:text-4xl"
        >
          {renderInline(trimmed.slice(3), `h2-${index}`)}
        </h2>
      );

      index += 1;
      continue;
    }

    // Blockquotes
    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];

      while (
        index < lines.length &&
        lines[index].trim().startsWith("> ")
      ) {
        quoteLines.push(lines[index].trim().slice(2));
        index += 1;
      }

      blocks.push(
        <blockquote
          key={`quote-${index}`}
          className="my-9 border-l-2 border-[#c5a866] bg-[#eeece3] px-6 py-5 font-serif text-xl italic leading-relaxed text-[#365849] md:px-8 md:text-2xl"
        >
          {quoteLines.map((quoteLine, quoteIndex) => (
            <p key={quoteIndex}>
              {renderInline(
                quoteLine,
                `quote-${index}-${quoteIndex}`
              )}
            </p>
          ))}
        </blockquote>
      );

      continue;
    }

    // Unordered lists
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];

      while (
        index < lines.length &&
        /^[-*]\s+/.test(lines[index].trim())
      ) {
        items.push(
          lines[index].trim().replace(/^[-*]\s+/, "")
        );
        index += 1;
      }

      blocks.push(
        <ul
          key={`ul-${index}`}
          className="my-6 list-disc space-y-3 pl-6 marker:text-[#b18d4d]"
        >
          {items.map((item, itemIndex) => (
            <li
              key={itemIndex}
              className="pl-1 leading-8 text-[#485d52]"
            >
              {renderInline(item, `ul-${index}-${itemIndex}`)}
            </li>
          ))}
        </ul>
      );

      continue;
    }

    // Ordered lists
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];

      while (
        index < lines.length &&
        /^\d+\.\s+/.test(lines[index].trim())
      ) {
        items.push(
          lines[index].trim().replace(/^\d+\.\s+/, "")
        );
        index += 1;
      }

      blocks.push(
        <ol
          key={`ol-${index}`}
          className="my-6 list-decimal space-y-3 pl-6 marker:font-semibold marker:text-[#a17e3e]"
        >
          {items.map((item, itemIndex) => (
            <li
              key={itemIndex}
              className="pl-1 leading-8 text-[#485d52]"
            >
              {renderInline(item, `ol-${index}-${itemIndex}`)}
            </li>
          ))}
        </ol>
      );

      continue;
    }

    // Ordinary paragraphs
    const paragraphLines = [trimmed];

    index += 1;

    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{2,3}\s|>\s|[-*]\s+|\d+\.\s+|!\[)/.test(
        lines[index].trim()
      )
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push(
      <p
        key={`p-${index}`}
        className="mb-6 text-[16px] leading-[1.95] text-[#485d52] md:text-[17px]"
      >
        {paragraphLines.map((paragraphLine, lineIndex) => (
          <span key={lineIndex}>
            {lineIndex > 0 ? " " : ""}
            {renderInline(
              paragraphLine,
              `p-${index}-${lineIndex}`
            )}
          </span>
        ))}
      </p>
    );
  }

  return blocks;
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    const loadPost = async () => {
      if (!slug) {
        setPost(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          "id,slug,title,content,cover_image,created_at,author,excerpt"
        )
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (!active) return;

      if (error) {
        setLoadError(true);
        setPost(null);
      } else {
        setPost((data as Post | null) ?? null);
      }

      setLoading(false);
    };

    setLoading(true);
    setLoadError(false);

    void loadPost();

    return () => {
      active = false;
    };
  }, [slug]);

  const description = useMemo(() => {
    if (!post) return "";

    const plainText = post.content
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[#>*_`~]/g, "")
      .replace(/[-]\s+/g, "")
      .replace(/\s+/g, " ")
      .trim();

    return (post.excerpt || plainText).slice(0, 155).trim();
  }, [post]);

  const cover = post?.cover_image || FALLBACK_IMAGE;

  const articleUrl = post
    ? `${SITE_URL}/blog/${post.slug}`
    : `${SITE_URL}/blog`;

  const jsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        image: absoluteUrl(cover),
        datePublished: post.created_at,
        dateModified: post.created_at,
        ...(post.author
          ? {
              author: {
                "@type": "Person",
                name: post.author,
              },
            }
          : {}),
        publisher: {
          "@type": "Organization",
          name: "Karembo Tours and Safaris",
        },
        mainEntityOfPage: articleUrl,
        description,
        wordCount: post.content
          .trim()
          .split(/\s+/)
          .filter(Boolean).length,
      }
    : undefined;

  // Loading state
  if (loading) {
    return (
      <main className="min-h-[65vh] bg-[#f7f5ef]">
        <div className="container-edge py-28">
          <div className="mx-auto max-w-3xl animate-pulse">
            <div className="h-3 w-28 rounded bg-[#e2dfd5]" />
            <div className="mt-7 h-12 w-4/5 rounded bg-[#e2dfd5]" />
            <div className="mt-4 h-5 w-2/3 rounded bg-[#e2dfd5]" />
            <div className="mt-12 aspect-[16/7] rounded-2xl bg-[#e2dfd5]" />

            <div className="mt-10 space-y-4">
              <div className="h-4 rounded bg-[#e2dfd5]" />
              <div className="h-4 rounded bg-[#e2dfd5]" />
              <div className="h-4 w-4/5 rounded bg-[#e2dfd5]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Database error
  if (loadError) {
    return (
      <main className="flex min-h-[65vh] items-center bg-[#f7f5ef]">
        <div className="container-edge mx-auto max-w-2xl py-24 text-center">
          <BookOpen
            className="mx-auto mb-5 text-[#a17e3e]"
            size={34}
            strokeWidth={1.4}
          />

          <h1 className="font-serif text-3xl text-[#183c32]">
            We couldn’t load this story.
          </h1>

          <p className="mt-3 leading-7 text-[#718077]">
            Please try again in a little while, or return to the journal.
          </p>

          <Link
            to="/blog"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#183c32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#285446]"
          >
            <ArrowLeft size={16} />
            Back to journal
          </Link>
        </div>
      </main>
    );
  }

  // Not found
  if (!post) {
    return (
      <main className="flex min-h-[65vh] items-center bg-[#f7f5ef]">
        <div className="container-edge mx-auto max-w-2xl py-24 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#a17e3e]">
            Karembo Journal
          </p>

          <h1 className="font-serif text-4xl text-[#183c32]">
            Story not found.
          </h1>

          <p className="mt-3 leading-7 text-[#718077]">
            This article may have moved or is no longer available.
          </p>

          <Link
            to="/blog"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#183c32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#285446]"
          >
            <ArrowLeft size={16} />
            Back to journal
          </Link>
        </div>
      </main>
    );
  }

  const publishedDate = formatPostDate(post.created_at);

  const wordCount = post.content
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const readingTime = Math.max(
    1,
    Math.ceil(wordCount / 220)
  );

  return (
    <>
      <Seo
        title={`${post.title} | Karembo Journal`}
        description={description}
        path={`/blog/${post.slug}`}
        image={cover}
        type="article"
        jsonLd={jsonLd}
      />

      <main className="min-h-screen overflow-hidden bg-[#f7f5ef] text-[#183c32]">
        {/* Article cover */}
        {post.cover_image && (
          <section className="relative isolate h-[42vh] min-h-[300px] max-h-[590px] bg-[#183c32] md:h-[58vh]">
            <img
              src={post.cover_image}
              alt={post.title}
              fetchPriority="high"
              className="absolute inset-0 -z-10 h-full w-full object-cover"
            />

            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#102b24]/45 via-transparent to-[#102b24]/10" />
          </section>
        )}

        <div className="container-edge pb-20 pt-10 md:pb-28 md:pt-14">
          <div className="mx-auto max-w-4xl">
            <Link
              to="/blog"
              className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#718077] transition hover:text-[#a17e3e]"
            >
              <ArrowLeft size={16} />
              Back to journal
            </Link>

            {/* Article heading */}
            <header className="mb-12 border-b border-[#e3dfd4] pb-10 md:mb-14 md:pb-12">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#a17e3e]">
                The Karembo Journal
              </p>

              <h1 className="max-w-4xl font-serif text-4xl font-medium leading-[1.12] tracking-tight text-[#183c32] sm:text-5xl md:text-6xl">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mt-6 max-w-3xl font-serif text-xl leading-relaxed text-[#718077] md:text-2xl">
                  {post.excerpt}
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-[#7c887f]">
                {publishedDate && (
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays
                      size={15}
                      className="text-[#a17e3e]"
                    />
                    {publishedDate}
                  </span>
                )}

                {post.author && (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#c5a866]" />
                    By {post.author}
                  </span>
                )}

                <span className="inline-flex items-center gap-2">
                  <Clock3
                    size={15}
                    className="text-[#a17e3e]"
                  />
                  {readingTime} min read
                </span>
              </div>
            </header>

            {/* Article body and sidebar */}
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_190px] lg:gap-16">
              <div className="min-w-0">
                <div className="prose-content">
                  {renderContent(post.content)}
                </div>

                <div className="mt-14 border-t border-[#e3dfd4] pt-8">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 rounded-full border border-[#cfc9b9] px-6 py-3 text-sm font-semibold text-[#183c32] transition hover:border-[#183c32] hover:bg-[#eeece3]"
                  >
                    <ArrowLeft size={16} />
                    More from the journal
                  </Link>
                </div>
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-28 border-l border-[#d9d3c4] pl-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a17e3e]">
                    Keep exploring
                  </p>

                  <p className="mt-4 font-serif text-2xl leading-snug text-[#183c32]">
                    Your Kenya story is waiting.
                  </p>

                  <p className="mt-3 text-sm leading-7 text-[#718077]">
                    Turn the inspiration into a journey of your own.
                  </p>

                  <Link
                    to="/safaris"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#a17e3e] transition hover:text-[#183c32]"
                  >
                    Explore safaris
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default BlogPost;
