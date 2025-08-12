import { Badge } from "@/components/ui/badge";
import { getPostBySlug } from "@/content/blog/posts";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Scheddly Blog`,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return notFound();

  const Content = post.content;

  return (
    <div className="w-full flex flex-col items-center py-8 mt-14 space-y-8">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <Link href="/blog" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        <article className="space-y-8">
          <header className="mb-6 flex flex-col gap-4">
            <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>

            <div className="flex flex-col gap-2">
              {post.description && (
                <p className="text-muted-foreground">{post.description}</p>
              )}

              <p className="text-sm text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString()}
                {post.readTimeMinutes
                  ? ` · ${post.readTimeMinutes} min read`
                  : ""}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          {post.coverImageUrl && (
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-auto rounded-lg aspect-blog-cover object-cover"
            />
          )}

          <div className="max-w-none flex flex-col gap-4 leading-7">
            <Content />
          </div>
        </article>
      </div>
    </div>
  );
}
