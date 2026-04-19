import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Seo } from "@/components/Seo";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

type Post = { id: string; slug: string; title: string; content: string; cover_image: string | null; created_at: string; author: string | null; excerpt?: string | null };

const renderInline = (text: string) =>
  text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-accent underline underline-offset-2 hover:text-accent/80">$1</a>');

const renderContent = (md: string) =>
  md.split("\n").map((line, i) => {
    const imgMatch = line.match(/^!\[(.*?)\]\((.+?)\)\s*$/);
    if (imgMatch) {
      return (
        <figure key={i} className="my-8 -mx-4 md:mx-0">
          <img src={imgMatch[2]} alt={imgMatch[1]} loading="lazy" decoding="async" className="w-full rounded-lg shadow-card" />
          {imgMatch[1] && <figcaption className="text-center text-xs text-muted-foreground mt-2">{imgMatch[1]}</figcaption>}
        </figure>
      );
    }
    if (line.startsWith("## ")) return <h2 key={i} className="font-serif text-2xl text-primary mt-10 mb-4">{line.slice(3)}</h2>;
    if (line.trim().startsWith("- ")) return <li key={i} className="ml-5 list-disc text-foreground/90" dangerouslySetInnerHTML={{ __html: renderInline(line.replace(/^\s*-\s*/, "")) }} />;
    if (/^\d+\.\s/.test(line.trim())) return <li key={i} className="ml-5 list-decimal text-foreground/90" dangerouslySetInnerHTML={{ __html: renderInline(line.replace(/^\s*\d+\.\s*/, "")) }} />;
    if (!line.trim()) return <div key={i} className="h-3" />;
    return <p key={i} className="text-foreground/90 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: renderInline(line) }} />;
  });

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle()
      .then(({ data }) => { setPost(data as Post | null); setLoading(false); });
  }, [slug]);

  if (loading) return <div className="container-edge py-20 text-center text-muted-foreground">Loading…</div>;
  if (!post) return <div className="container-edge py-20 text-center"><h1 className="font-serif text-2xl text-primary">Post not found</h1></div>;

  return (
    <article>
      {post.cover_image && (
        <div className="aspect-[21/9] md:aspect-[3/1] overflow-hidden">
          <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="container-edge max-w-3xl py-16">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to journal
        </Link>
        <p className="text-xs uppercase tracking-widest text-accent mb-3">
          {format(new Date(post.created_at), "dd MMM yyyy")} · {post.author}
        </p>
        <h1 className="font-serif text-3xl md:text-5xl text-primary mb-8 leading-tight">{post.title}</h1>
        <div className="prose-content">{renderContent(post.content)}</div>
      </div>
    </article>
  );
};

export default BlogPost;
