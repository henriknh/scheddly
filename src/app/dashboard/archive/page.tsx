import { getPosts } from "@/app/api/post/get-posts";
import { ArchivedPostList } from "@/components/archived-post-list";
import { Header } from "@/components/common/Header";

export default async function ArchivePage() {
  const posts = await getPosts({
    archived: true,
  });

  return (
    <div className="space-y-4">
      <Header>Archive</Header>

      <ArchivedPostList posts={posts} />
    </div>
  );
}
