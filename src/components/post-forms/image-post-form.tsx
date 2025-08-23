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
import { SocialMediaSelector } from "@/components/social-media-selector";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostType } from "@/generated/prisma";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ImagePostFormProps {
  post?: PostWithRelations;
  integrations: SocialMediaIntegrationWithRelations[];
  alreadyScheduledDates: Date[];
  initialDate?: string;
}

export function ImagePostForm({
  post,
  integrations,
  alreadyScheduledDates = [],
  initialDate,
}: ImagePostFormProps) {
  const router = useRouter();
  const [caption, setCaption] = useState(post?.description || "");
  const [images, setImages] = useState<File[]>([]);
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
      setCaption(post.description);
      setScheduledDate(post.scheduledAt || null);
      setSocialMediaPosts(
        post.socialMediaPosts.map((post) => ({
          socialMediaIntegration: post.socialMediaIntegration,
          xShareWithFollowers: post.xShareWithFollowers ?? true,
          xCommunityId: post.xCommunityId ?? null,
        }))
      );

      Promise.all(
        post.images.map(async (image) => {
          const response = await fetch(`/api/file/${image.id}`);
          const blob = await response.blob();
          return new File([blob], image.path);
        })
      ).then((files) => setImages(files));
    }
  }, [post, integrations]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const data: CreatePostParams = {
        description: caption,
        postType: PostType.IMAGE,
        images,
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
          <span className="font-medium">Content</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg border-2 border-border"
            >
              <Image
                src={URL.createObjectURL(image)}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover rounded-lg"
                unoptimized
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <label className="flex items-center justify-center aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Plus className="h-8 w-8" />
              <span className="text-sm">Add Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                multiple
              />
            </div>
          </label>
        </div>

        <Textarea
          placeholder="Write a caption for your images..."
          value={caption}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setCaption(e.target.value)
          }
          maxLength={280}
        />
        <div className="text-sm text-muted-foreground text-right">
          {caption.length}/280 characters
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
            postType="IMAGE"
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
            images.length === 0 ||
            socialMediaPosts.length === 0 ||
            !!post?.archived
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
