import { getPost } from "@/app/api/post/get-post";
import { getSocialMediaIntegrations } from "@/app/api/social-media-integration/get-social-media-integrations";
import { Header } from "@/components/common/Header";
import { ImagePostDetails } from "@/components/post-details/image-post-details";
import { TextPostDetails } from "@/components/post-details/text-post-details";
import { VideoPostDetails } from "@/components/post-details/video-post-details";
import { ImagePostForm } from "@/components/post-forms/image-post-form";
import { TextPostForm } from "@/components/post-forms/text-post-form";
import { VideoPostForm } from "@/components/post-forms/video-post-form";
import { PostType } from "@/generated/prisma";
import { postIsEditable } from "@/lib/post";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/common/breadcrumb";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  try {
    const [post, integrations] = await Promise.all([
      getPost(slug),
      getSocialMediaIntegrations(),
    ]);

    const postTypeLabel = post.postType === PostType.TEXT
      ? "Text Post"
      : post.postType === PostType.IMAGE
      ? "Image Post"
      : "Video Post";

    return (
      <div className="space-y-4">
        <Breadcrumb label={postTypeLabel} href={`/dashboard/posts/${slug}`} />
        <Header>
          {postTypeLabel}
        </Header>

        {postIsEditable(post) ? (
          <>
            {post.postType === PostType.TEXT && (
              <TextPostForm post={post} integrations={integrations} />
            )}
            {post.postType === PostType.IMAGE && (
              <ImagePostForm post={post} integrations={integrations} />
            )}
            {post.postType === PostType.VIDEO && (
              <VideoPostForm post={post} integrations={integrations} />
            )}
          </>
        ) : (
          <div>
            {post.postType === PostType.TEXT && (
              <TextPostDetails post={post} integrations={integrations} />
            )}
            {post.postType === PostType.IMAGE && (
              <ImagePostDetails post={post} integrations={integrations} />
            )}
            {post.postType === PostType.VIDEO && (
              <VideoPostDetails post={post} integrations={integrations} />
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    notFound();
  }
}
