import { Badge } from "@/components/ui/badge";
import { getAllPosts } from "@/content/blog/posts";
import Link from "next/link";

export const metadata = {
  title: "Blog | Scheddly",
  description:
    "Articles on social media workflows, integrations, and productivity.",
};

export default function BlogIndexPage() {
  const allPosts = getAllPosts();

  return (
    <section className="container mx-auto w-full flex flex-col py-8 mt-14">
      <h1 className="text-3xl font-bold mb-2">Blog</h1>
      <p className="text-muted-foreground mb-8">
        Practical guides and insights on brand-first social media workflows.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        {allPosts.map((post) => (
          <Link
            key={post.slug}
            className="hover:text-muted-foreground transition-colors duration-300"
            href={`/blog/${post.slug}`}
          >
            <article className="py-6 flex flex-col gap-4 first:pt-0 last:pb-0">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full h-auto rounded-lg aspect-blog-cover object-cover"
              />

              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString()}
                  {post.readTimeMinutes
                    ? ` · ${post.readTimeMinutes} min read`
                    : ""}
                </p>
              </div>

              <p className="text-sm leading-6 text-muted-foreground line-clamp-2">
                {post.description}
              </p>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
