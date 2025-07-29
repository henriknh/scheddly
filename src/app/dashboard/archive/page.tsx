import { getPosts } from "@/app/api/post/get-posts";
import { ArchivedPostList } from "@/components/archived-post-list";

export default async function ArchivePage() {
  const posts = await getPosts({
    archived: true,
  });

  return <ArchivedPostList posts={posts} />;
}
