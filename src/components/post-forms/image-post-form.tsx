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
import { FileWarning, Plus, X } from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface FileData {
  file: File;
  width: number;
  height: number;
}

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
  const [isLoading, setIsLoading] = useState(false);
  const [caption, setCaption] = useState(post?.description || "");
  const [images, setImages] = useState<FileData[]>([]);
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
        post.images.map(async (image): Promise<FileData> => {
          const response = await fetch(`/api/file/${image.id}`);
          const blob = await response.blob();

          const file = new File([blob], image.path);

          return new Promise((resolve) => {
            const image = new Image();
            image.src = URL.createObjectURL(blob);
            image.onload = () => {
              resolve({
                file,
                width: image.width,
                height: image.height,
              });
            };
          });
        })
      ).then((files) => setImages(files));
    }
  }, [post, integrations]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = await Promise.all(
        Array.from(e.target.files).map((file): Promise<FileData> => {
          return new Promise((resolve) => {
            const image = new Image();
            image.src = URL.createObjectURL(file);
            image.onload = () => {
              resolve({
                file,
                width: image.width,
                height: image.height,
              });
            };
          });
        })
      );

      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const data: CreatePostParams = {
        description: caption,
        postType: PostType.IMAGE,
        images: images.map((image) => image.file),
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
    } finally {
      setIsLoading(false);
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

        <div className="flex gap-4 overflow-x-scroll">
          {images.map((image, index) => {
            const aspectRatio = image.width / image.height;
            const height = 256;

            return (
              <div
                key={index}
                className="shrink-0 relative rounded-lg border-2 border-border flex items-center justify-center"
                style={{
                  height,
                  width: height * aspectRatio,
                }}
              >
                <NextImage
                  src={URL.createObjectURL(image.file)}
                  alt={`Upload ${index + 1}`}
                  height={Math.max(image.height, 256)}
                  width={Math.max(image.width * aspectRatio, 256)}
                  className="object-cover rounded-lg"
                  unoptimized
                />

                <div className="absolute top-2 right-2 flex items-center gap-1">
                  {image.width < 512 && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant="outline" size="icon">
                          <FileWarning />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Small images are not recommended and might look blurry
                        on social media.
                      </TooltipContent>
                    </Tooltip>
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          <label className="flex items-center justify-center h-[256px] aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer">
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
            postType={PostType.IMAGE}
            socialMediaPosts={socialMediaPosts}
            onChangeSocialMediaPosts={setSocialMediaPosts}
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
            isLoading ||
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
