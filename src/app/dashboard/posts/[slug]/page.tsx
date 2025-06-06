import { getPost } from "@/app/api/post/get-post";
import { getSocialMediaIntegrations } from "@/app/api/social-media-integration/get-social-media-integrations";
import { Header } from "@/components/common/Header";
import { ImagePostForm } from "@/components/post-forms/image-post-form";
import { TextPostForm } from "@/components/post-forms/text-post-form";
import { VideoPostForm } from "@/components/post-forms/video-post-form";
import { PostType } from "@/generated/prisma";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  try {
    const [post, integrations] = await Promise.all([
      getPost(slug),
      getSocialMediaIntegrations(),
    ]);

    return (
      <div className="space-y-4">
        <>
          <Header>Edit Post</Header>
          {post.postType === PostType.TEXT && (
            <TextPostForm integrations={integrations} post={post} />
          )}
          {post.postType === PostType.IMAGE && (
            <ImagePostForm integrations={integrations} post={post} />
          )}
          {post.postType === PostType.VIDEO && (
            <VideoPostForm integrations={integrations} post={post} />
          )}
        </>
      </div>
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    notFound();
  }
}
