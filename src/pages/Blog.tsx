import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CalendarDays, Feather } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Seo } from "@/components/Seo";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  created_at: string;
  author: string | null;
};

const HERO = "/gallery/zebras-flamingos-lake.jpg";
const SITE_URL = "https://karembotours.co.ke";

const formatPostDate = (value: string) => {
  const date = parseISO(value);
  return isValid(date) ? format(date, "dd MMM yyyy") : "";
};

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    const loadPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,slug,title,excerpt,cover_image,created_at,author")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        setLoadError(true);
        setPosts([]);
      } else {
        setPosts((data as Post[]) ?? []);
      }

      setLoading(false);
    };

    void loadPosts();

    return () => {
      active = false;
    };
  }, []);

  const structuredPosts = posts.map((post, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.created_at,
      ...(post.excerpt ? { description: post.excerpt } : {}),
      ...(post.cover_image
        ? {
            image: post.cover_image.startsWith("http")
              ? post.cover_image
              : `${SITE_URL}${post.cover_image}`,
          }
        : {}),
    },
  }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Karembo Journal",
      description:
        "Kenya safari tips, travel guides, wildlife insights and travel inspiration from Karembo Tours.",
      url: `${SITE_URL}/blog`,
      image: `${SITE_URL}${HERO}`,
      blogPost: posts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        url: `${SITE_URL}/blog/${post.slug}`,
        datePublished: post.created_at,
        ...(post.author
          ? { author: { "@type": "Person", name: post.author } }
          : {}),
      })),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: structuredPosts,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Karembo Journal",
          item: `${SITE_URL}/blog`,
        },
      ],
    },
  ];

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <>
      <Seo
        title="Kenya Safari Tips & Travel Guides | Karembo Journal"
        description="Plan your Kenya trip with practical safari travel guides, packing tips, wildlife insights and Nairobi travel inspiration from Karembo Tours."
        path="/blog"
        image={HERO}
        type="website"
        jsonLd={jsonLd}
      />

      <main className="overflow-hidden bg-[#f7f5ef] text-[#183c32]">
        {/* Journal masthead and cinematic hero */}
        <section className="relative isolate flex min-h-[570px] items-end bg-[#102b24] md:min-h-[650px]">
          <img
            src={HERO}
            alt="Zebras and flamingos gathered along a Kenyan lake"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
            fetchPriority="high"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b211c]/90 via-[#102b24]/55 to-[#102b24]/10" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#102b24]/80 via-transparent to-[#102b24]/15" />

          <div className="container-edge w-full pb-20 pt-36 md:pb-24">
            <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#d6bd7b]">
              <Feather size={15} />
              The Karembo Journal
            </div>
            <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1.04] tracking-tight text-[#fffdf7] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              A little inspiration
              <br />
              <span className="italic text-[#d6bd7b]">for the road ahead.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/85 md:text-lg">
              Travel stories, practical guides and fresh perspectives to help
              you experience Kenya with curiosity and confidence.
            </p>
            <a
              href="#latest-stories"
              className="mt-9 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#d6bd7b] px-7 py-3 text-sm font-semibold text-[#183c32] transition hover:bg-[#e6d39e]"
            >
              Read the journal <ArrowRight size={17} />
            </a>
          </div>
        </section>

        {/* Introductory editorial strip */}
        <section className="container-edge grid gap-8 py-16 md:grid-cols-[0.8fr_1.2fr] md:items-end md:py-20">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#a17e3e]">
              Notes from the journey
            </p>
            <h2 className="max-w-md font-serif text-4xl leading-tight text-[#183c32] md:text-5xl">
              Know before you go. Feel more when you arrive.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[#657269] md:justify-self-end md:text-lg">
            From planning your first safari to understanding the landscapes
            and wildlife you may encounter, explore ideas and information for
            making more of your time in Kenya.
          </p>
        </section>

        {/* Latest posts */}
        <section
          id="latest-stories"
          className="scroll-mt-24 border-t border-[#e4e0d5] bg-[#eeece3] py-20 md:py-24"
        >
          <div className="container-edge">
            <div className="mb-11 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#a17e3e]">
                  Explore the journal
                </p>
                <h2 className="font-serif text-4xl leading-tight text-[#183c32] md:text-5xl">
                  Latest stories
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#718077]">
                <BookOpen size={17} />
                {loading
                  ? "Loading articles"
                  : `${posts.length} ${posts.length === 1 ? "article" : "articles"}`}
              </div>
            </div>

            {loading ? (
              <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-2xl bg-white"
                    aria-hidden="true"
                  >
                    <div className="aspect-[16/10] animate-pulse bg-[#e2dfd5]" />
                    <div className="space-y-4 p-6">
                      <div className="h-3 w-28 animate-pulse rounded bg-[#e2dfd5]" />
                      <div className="h-6 w-4/5 animate-pulse rounded bg-[#e2dfd5]" />
                      <div className="h-3 w-full animate-pulse rounded bg-[#e2dfd5]" />
                      <div className="h-3 w-2/3 animate-pulse rounded bg-[#e2dfd5]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : loadError ? (
              <div className="rounded-3xl border border-[#e2ddcf] bg-white/75 px-6 py-16 text-center">
                <h3 className="font-serif text-2xl text-[#183c32]">
                  Stories are taking a short break.
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#68766e]">
                  We couldn’t load the journal just now. Please try again in a
                  little while.
                </p>
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-3xl border border-[#e2ddcf] bg-white/75 px-6 py-16 text-center">
                <h3 className="font-serif text-2xl text-[#183c32]">
                  New stories are on their way.
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#68766e]">
                  Check back soon for travel inspiration and guides from across
                  Kenya.
                </p>
              </div>
            ) : (
              <>
                {featuredPost && (
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="group mb-8 grid overflow-hidden rounded-3xl bg-[#183c32] shadow-[0_18px_50px_rgba(24,60,50,0.10)] transition hover:shadow-[0_24px_60px_rgba(24,60,50,0.18)] md:grid-cols-[1.15fr_0.85fr]"
                  >
                    <div className="relative min-h-[260px] overflow-hidden bg-[#294d40] md:min-h-[390px]">
                      {featuredPost.cover_image ? (
                        <img
                          src={featuredPost.cover_image}
                          alt={featuredPost.title}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[#d6bd7b]">
                          <BookOpen size={52} strokeWidth={1} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#102b24]/35 to-transparent" />
                      <span className="absolute left-6 top-6 rounded-full bg-[#d6bd7b] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#183c32]">
                        Featured story
                      </span>
                    </div>
                    <div className="flex flex-col justify-center p-7 text-[#fffdf7] sm:p-10 lg:p-14">
                      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/60">
                        {formatPostDate(featuredPost.created_at) && (
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays size={14} />
                            {formatPostDate(featuredPost.created_at)}
                          </span>
                        )}
                        {featuredPost.author && (
                          <span>By {featuredPost.author}</span>
                        )}
                      </div>
                      <h3 className="font-serif text-3xl leading-tight transition-colors group-hover:text-[#e4cc91] sm:text-4xl lg:text-[2.7rem]">
                        {featuredPost.title}
                      </h3>
                      {featuredPost.excerpt && (
                        <p className="mt-5 line-clamp-4 text-sm leading-7 text-white/70 sm:text-base">
                          {featuredPost.excerpt}
                        </p>
                      )}
                      <span className="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-[#d6bd7b]">
                        Read the story
                        <ArrowRight
                          size={17}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                )}

                {remainingPosts.length > 0 && (
                  <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                    {remainingPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e3dfd4] bg-[#fbfaf6] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(24,60,50,0.10)]"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-[#dcded4]">
                          {post.cover_image ? (
                            <img
                              src={post.cover_image}
                              alt={post.title}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[#718077]">
                              <BookOpen size={38} strokeWidth={1} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[#8a938a]">
                            {formatPostDate(post.created_at) && (
                              <span>{formatPostDate(post.created_at)}</span>
                            )}
                            {post.author && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{post.author}</span>
                              </>
                            )}
                          </div>
                          <h3 className="font-serif text-2xl leading-snug text-[#183c32] transition-colors group-hover:text-[#a17e3e]">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#718077]">
                              {post.excerpt}
                            </p>
                          )}
                          <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[#a17e3e]">
                            Read article
                            <ArrowRight
                              size={15}
                              className="transition-transform group-hover:translate-x-1"
                            />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Journal footer CTA */}
        <section className="bg-[#183c32] py-16 text-[#fffdf7] md:py-20">
          <div className="container-edge flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#d6bd7b]">
                Turn inspiration into a journey
              </p>
              <h2 className="font-serif text-3xl leading-tight md:text-4xl">
                Your own Kenya story starts here.
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Explore our safari and travel experiences or start planning a
                trip shaped around your interests.
              </p>
            </div>
            <Link
              to="/safaris"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-[#d6bd7b] px-7 py-3 text-sm font-semibold text-[#183c32] transition hover:bg-[#e6d39e]"
            >
              Explore safaris <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default Blog;
