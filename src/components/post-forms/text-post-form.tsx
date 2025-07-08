"use client";

import { createPost } from "@/app/api/post/create-post";
import { editPost } from "@/app/api/post/edit-post";
import { PostWithRelations } from "@/app/api/post/types";
import { SocialMediaIntegrationWithRelations } from "@/app/api/social-media-integration/types";
import { ArchivePostButton } from "@/components/archive-post-button";
import { PostScheduler } from "@/components/post-scheduler";
import { SocialMediaIntegrationSelector } from "@/components/social-media-integration-selector";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostType } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TextPostFormProps {
  post?: PostWithRelations;
  integrations: SocialMediaIntegrationWithRelations[];
}

export function TextPostForm({ post, integrations }: TextPostFormProps) {
  const router = useRouter();
  const [content, setContent] = useState(post?.description || "");
  const [scheduledDate, setScheduledDate] = useState<Date | null>(
    post?.scheduledAt || null
  );
  const [selectedIntegrationIds, setSelectedIntegrationIds] = useState<
    string[]
  >(() => {
    if (!post) return [];
    // Map from social media types and brand IDs to integration IDs
    const selectedSocialMediaPosts = post.socialMediaPosts;
    return integrations
      .filter((integration) =>
        selectedSocialMediaPosts.some(
          (post) =>
            post.socialMedia === integration.socialMedia &&
            post.brandId === integration.brandId
        )
      )
      .map((integration) => integration.id);
  });

  useEffect(() => {
    if (post) {
      setContent(post.description);
      setScheduledDate(post.scheduledAt || null);
      // Map from social media types and brand IDs to integration IDs
      const selectedSocialMediaPosts = post.socialMediaPosts;
      const selectedIds = integrations
        .filter((integration) =>
          selectedSocialMediaPosts.some(
            (post) =>
              post.socialMedia === integration.socialMedia &&
              post.brandId === integration.brandId
          )
        )
        .map((integration) => integration.id);
      setSelectedIntegrationIds(selectedIds);
    }
  }, [post, integrations]);

  const handleSubmit = async () => {
    try {
      const selectedIntegrations = integrations.filter((integration) =>
        selectedIntegrationIds.includes(integration.id)
      );

      const data = {
        description: content,
        postType: PostType.TEXT,
        scheduledAt: scheduledDate,
        socialMediaIntegrations: selectedIntegrations,
      };

      const submit = post ? editPost(post.id, data) : createPost(data);

      await submit
        .then(() => {
          toast.success(
            post ? "Post updated successfully" : "Post created successfully"
          );
          router.push("/dashboard/posts");
        })
        .catch((error) => {
          toast.error(post ? "Failed to update post" : "Failed to create post");
          console.error(
            post ? "Failed to update post" : "Failed to create post",
            error
          );
        });
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            1
          </div>
          <span className="font-medium">Post</span>
        </div>

        <Textarea
          placeholder="Write your post content here..."
          className="min-h-[200px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
        />
        <div className="text-sm text-muted-foreground text-right">
          {content.length}/280 characters
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            2
          </div>
          <span className="font-medium">Social Media Platforms</span>
        </div>

        <div className="space-y-2">
          <SocialMediaIntegrationSelector
            onSelectionChange={setSelectedIntegrationIds}
            selectedIntegrationIds={selectedIntegrationIds}
            postType="TEXT"
            integrations={integrations}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            3
          </div>
          <span className="font-medium">Scheduling</span>
        </div>

        <PostScheduler
          initialDate={post?.scheduledAt}
          onScheduleChange={setScheduledDate}
        />
      </div>

      <div className="flex justify-end gap-2">
        {post && <ArchivePostButton postId={post.id} />}
        <Button
          onClick={handleSubmit}
          disabled={!content || selectedIntegrationIds.length === 0}
        >
          {post
            ? scheduledDate
              ? "Update scheduled post"
              : "Post immediately"
            : scheduledDate
            ? "Schedule Post"
            : "Post Now"}
        </Button>
      </div>
    </div>
  );
}
