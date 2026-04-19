import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/PageHero";
import { Seo } from "@/components/Seo";
import { format } from "date-fns";

type Post = { id: string; slug: string; title: string; excerpt: string | null; cover_image: string | null; created_at: string; author: string | null };

const HERO = "/gallery/zebras-flamingos-lake.jpg";

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    supabase.from("blog_posts").select("*").eq("published", true).order("created_at", { ascending: false })
      .then(({ data }) => setPosts((data as Post[]) ?? []));
  }, []);

  return (
    <>
      <Seo
        title="Karembo Journal — Kenya Safari Tips & Travel Guides"
        description="In-depth Kenya travel guides: when to visit the Masai Mara, the Big Five, packing lists, honeymoon ideas, budget tips and conservation."
        path="/blog"
        image="/gallery/zebras-flamingos-lake.jpg"
      />
      <PageHero image={HERO} eyebrow="Travel inspiration" title="Karembo Journal" subtitle="Stories, guides and tips for planning your perfect Kenyan adventure." />
      <section className="py-20">
        <div className="container-edge">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elegant transition-shadow">
                {p.cover_image && (
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={p.cover_image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-6">
                  <p className="text-xs text-muted-foreground mb-2">
                    {format(new Date(p.created_at), "dd MMM yyyy")} · {p.author}
                  </p>
                  <h2 className="font-serif text-xl text-primary group-hover:text-accent transition mb-2 leading-snug">{p.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
