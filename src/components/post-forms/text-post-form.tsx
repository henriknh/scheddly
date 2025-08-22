"use client";

import {
  createPost,
  CreatePostParams,
  SocialMediaPostParams,
} from "@/app/api/post/create-post";
import { editPost } from "@/app/api/post/edit-post";
import { PostWithRelations } from "@/app/api/post/types";
import { SocialMediaIntegrationWithRelations } from "@/app/api/social-media-integration/types";
import { ArchivePostButton } from "@/components/archive-post-button";
import { PostScheduler } from "@/components/post-scheduler";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostType } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SocialMediaSelector } from "../social-media-selector";

interface TextPostFormProps {
  post?: PostWithRelations;
  integrations: SocialMediaIntegrationWithRelations[];
  alreadyScheduledDates: Date[];
  initialDate?: string;
}

export function TextPostForm({
  post,
  integrations,
  alreadyScheduledDates = [],
  initialDate,
}: TextPostFormProps) {
  const router = useRouter();
  const [content, setContent] = useState(post?.description || "");
  const [scheduledDate, setScheduledDate] = useState<Date | null>(() => {
    if (post?.scheduledAt) return post.scheduledAt;
    if (initialDate) return new Date(initialDate);
    return null;
  });
  const [socialMediaPosts, setSocialMediaPosts] = useState<
    SocialMediaPostParams[]
  >(
    post?.socialMediaPosts.map((post) => ({
      socialMediaIntegration: post.socialMediaIntegration,
      xShareWithFollowers: post.xShareWithFollowers ?? true,
      xCommunityId: post.xCommunityId ?? null,
    })) || []
  );

  useEffect(() => {
    if (post) {
      setContent(post.description);
      setScheduledDate(post.scheduledAt || null);
      setSocialMediaPosts(
        post.socialMediaPosts.map((post) => ({
          socialMediaIntegration: post.socialMediaIntegration,
          xShareWithFollowers: post.xShareWithFollowers ?? true,
          xCommunityId: post.xCommunityId ?? null,
        }))
      );
    }
  }, [post, integrations]);

  const handleSubmit = async () => {
    try {
      const data: CreatePostParams = {
        description: content,
        postType: PostType.TEXT,
        scheduledAt: scheduledDate,
        socialMediaPosts,
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
          <SocialMediaSelector
            socialMediaPosts={socialMediaPosts}
            onChangeSocialMediaPosts={setSocialMediaPosts}
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
          alreadyScheduledDates={alreadyScheduledDates}
        />
      </div>

      <div className="flex justify-end gap-2">
        {post && <ArchivePostButton post={post} />}
        <Button
          onClick={handleSubmit}
          disabled={
            !content || socialMediaPosts.length === 0 || !!post?.archived
          }
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
