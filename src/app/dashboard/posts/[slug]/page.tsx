import { getPost } from "@/app/api/post/get-post";
import { Header } from "@/components/common/Header";
import { PostDetails } from "@/components/posts/PostDetails";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  try {
    const post = await getPost(slug);
    return (
      <div className="space-y-4">
        <Header>Post Details</Header>
        <PostDetails post={post} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    notFound();
  }
}
