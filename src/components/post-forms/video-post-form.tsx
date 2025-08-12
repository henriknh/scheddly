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
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { PostType } from "@/generated/prisma";
import { Video, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SocialMediaSelector } from "../social-media-selector";

interface VideoPostFormProps {
  post?: PostWithRelations;
  integrations: SocialMediaIntegrationWithRelations[];
  initialDate?: string;
}

export function VideoPostForm({
  post,
  integrations,
  initialDate,
}: VideoPostFormProps) {
  const router = useRouter();
  const [description, setDescription] = useState(post?.description || "");
  const [video, setVideo] = useState<File | null>(null);
  const [videoCover, setVideoCover] = useState<File | null>(null);
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
      setDescription(post.description);
      setScheduledDate(post.scheduledAt || null);
      setSocialMediaPosts(
        post.socialMediaPosts.map((post) => ({
          socialMediaIntegration: post.socialMediaIntegration,
          xShareWithFollowers: post.xShareWithFollowers ?? true,
          xCommunityId: post.xCommunityId ?? null,
        }))
      );

      Promise.all([
        post.video &&
          fetch(`/api/file/${post.video.id}`)
            .then((response) => response.blob())
            .then((blob) => new File([blob], post.video!.path)),
        post.videoCover &&
          fetch(`/api/file/${post.videoCover.id}`)
            .then((response) => response.blob())
            .then((blob) => new File([blob], post.videoCover!.path)),
      ]).then(([videoFile, videoCoverFile]) => {
        if (videoFile) setVideo(videoFile);
        if (videoCoverFile) setVideoCover(videoCoverFile);
      });
    }
  }, [post, integrations]);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const videoFile = e.target.files[0];
      setVideo(videoFile);
      extractVideoCoverFromVideo(videoFile, 0);
    }
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const extractVideoCoverFromVideo = async (
    video: File,
    timestampPercentage: number
  ) => {
    if (!video) return;

    const videoElement = document.createElement("video");
    videoElement.src = URL.createObjectURL(video);

    // Wait for video to be loaded
    await new Promise((resolve) => {
      videoElement.onloadeddata = () => {
        videoElement.currentTime =
          (timestampPercentage / 100) * videoElement.duration;
        resolve(true);
      };
    });

    // Wait for the specific frame to be loaded
    await new Promise((resolve) => {
      videoElement.onseeked = () => {
        resolve(true);
      };
    });

    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("Failed to get canvas context");
      return;
    }

    ctx.drawImage(videoElement, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        setVideoCover(
          new File([blob], "video-cover.png", { type: "image/png" })
        );
      } else {
        console.error("Failed to create blob from canvas");
      }
    }, "image/png");
  };

  const handleSubmit = async () => {
    try {
      if (!video) return;

      const data: CreatePostParams = {
        description,
        postType: PostType.VIDEO,
        video,
        videoCover,
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

        <div className="flex space-x-2 h-[400px]">
          <div className="aspect-video rounded-lg border-2 border-border overflow-hidden max-h-[400px]">
            {video ? (
              <div className="relative w-full h-full">
                <video
                  src={URL.createObjectURL(video)}
                  className="w-full h-full object-cover bg-black"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={removeVideo}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Video className="h-8 w-8" />
                  <span className="text-sm">Upload Video</span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                </div>
              </label>
            )}
          </div>
        </div>
        {video && (
          <div className="flex space-x-2">
            <div className="aspect-video rounded-lg border-2 border-border overflow-hidden max-h-[400px]">
              {videoCover ? (
                <img
                  src={URL.createObjectURL(videoCover)}
                  alt="Video cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <span className="text-sm">Upload Video Cover</span>
                  </div>
                </label>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">
                Select frame
              </span>
              <Slider
                defaultValue={[0]}
                max={100}
                step={1}
                className="w-[200px]"
                onValueChange={(value) => {
                  if (video) {
                    extractVideoCoverFromVideo(video, value[0]);
                  }
                }}
              />
            </div>
          </div>
        )}

        <Textarea
          placeholder="Write a description for your video..."
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
          maxLength={280}
        />
        <div className="text-sm text-muted-foreground text-right">
          {description.length}/280 characters
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
            postType="VIDEO"
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
          disabled={!video || socialMediaPosts.length === 0 || !!post?.archived}
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
