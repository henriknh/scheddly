"use client";

import { createPost } from "@/app/api/post/create-post";
import { editPost } from "@/app/api/post/edit-post";
import { PostWithRelations } from "@/app/api/post/types";
import { SocialMediaIntegrationWithRelations } from "@/app/api/social-media-integration/types";
import { PostScheduler } from "@/components/post-scheduler";
import { SocialMediaIntegrationSelector } from "@/components/social-media-integration-selector";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostType } from "@/generated/prisma";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArchivePostButton } from "@/components/archive-post-button";

interface ImagePostFormProps {
  post?: PostWithRelations;
  integrations: SocialMediaIntegrationWithRelations[];
}

export function ImagePostForm({ post, integrations }: ImagePostFormProps) {
  const router = useRouter();
  const [caption, setCaption] = useState(post?.description || "");
  const [images, setImages] = useState<File[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(
    post?.scheduledAt || null
  );
  const [selectedIntegrationIds, setSelectedIntegrationIds] = useState<
    string[]
  >(() => {
    if (!post) return [];
    // Map from social media types and brand IDs to integration IDs
    const selectedSocialMediaPosts = post?.socialMediaPosts || [];
    return integrations
      .filter((integration) =>
        selectedSocialMediaPosts.some(
          (post) => post.socialMediaIntegrationId === integration.id
        )
      )
      .map((integration) => integration.id);
  });

  useEffect(() => {
    if (post) {
      setCaption(post.description);
      setScheduledDate(post.scheduledAt || null);
      // Map from social media posts to integration IDs
      const selectedSocialMediaPosts = post.socialMediaPosts;
      const selectedIds = integrations
        .filter((integration) =>
          selectedSocialMediaPosts.some(
            (post) => post.socialMediaIntegrationId === integration.id
          )
        )
        .map((integration) => integration.id);
      setSelectedIntegrationIds(selectedIds);

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
      const selectedIntegrations = integrations.filter((integration) =>
        selectedIntegrationIds.includes(integration.id)
      );

      const data = {
        description: caption,
        postType: PostType.IMAGE,
        images,
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
          <SocialMediaIntegrationSelector
            onSelectionChange={setSelectedIntegrationIds}
            selectedIntegrationIds={selectedIntegrationIds}
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
        />
      </div>

      <div className="flex justify-end gap-2">
        {post && <ArchivePostButton post={post} />}
        <Button
          onClick={handleSubmit}
          disabled={
            images.length === 0 ||
            selectedIntegrationIds.length === 0 ||
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
