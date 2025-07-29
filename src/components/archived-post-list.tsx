"use client";

import { PostWithRelations } from "@/app/api/post/types";
import { ArchivedPostCard } from "./archived-post-card";

export function ArchivedPostList({ posts }: { posts: PostWithRelations[] }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <ArchivedPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
