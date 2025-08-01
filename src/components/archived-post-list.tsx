"use client";

import { PostWithRelations } from "@/app/api/post/types";
import { ArchivedPostCard } from "./archived-post-card";

export function ArchivedPostList({ posts }: { posts: PostWithRelations[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No archived posts found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <ArchivedPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
