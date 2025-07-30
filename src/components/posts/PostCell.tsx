"use client";

import { PostWithRelations } from "@/app/api/post/types";
import { PostType } from "@/generated/prisma";
import { getSocialMediaPlatform } from "@/lib/social-media-platforms";
import { cn } from "@/lib/utils";
import { ImageIcon, TextIcon, VideoIcon } from "lucide-react";
import Link from "next/link";

interface PostCellProps {
  post: PostWithRelations;
  isCurrentDay: boolean;
}

export function PostCell({ post, isCurrentDay }: PostCellProps) {
  const getPostTypeIcon = (postType: PostType) => {
    switch (postType) {
      case PostType.TEXT:
        return <TextIcon className="h-4 w-4" />;
      case PostType.IMAGE:
        return <ImageIcon className="h-4 w-4" />;
      case PostType.VIDEO:
        return <VideoIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getSocialMediaPostIcons = (post: PostWithRelations) => {
    return post.socialMediaPosts.map((socialMediaPost) => {
      const platform = getSocialMediaPlatform(socialMediaPost.socialMedia);
      const PlatformIcon = platform?.Icon;

      return {
        id: socialMediaPost.id,
        brand: socialMediaPost.brand.name,
        platform: platform?.name || socialMediaPost.socialMedia,
        icon: PlatformIcon,
        failed: !!socialMediaPost.failedAt,
        posted: !!socialMediaPost.postedAt,
      };
    });
  };

  type BgColor =
    | "bg-warning"
    | "bg-destructive"
    | "bg-success"
    | "bg-info"
    | "bg-border";

  const getPostStatus = (): BgColor[] => {
    const hasFailed = post.socialMediaPosts.some(
      (socialMediaPost) => socialMediaPost.failedAt
    );

    const hasPosted = post.socialMediaPosts.some(
      (socialMediaPost) => socialMediaPost.postedAt
    );

    const isPending = post.scheduledAt && post.scheduledAt < new Date();

    const colors: BgColor[] = [];

    if (hasFailed || hasPosted) {
      if (hasFailed) {
        colors.push("bg-destructive");
      }

      if (hasPosted) {
        colors.push("bg-success");
      }
    } else {
      if (post.socialMediaPosts.length === 0) {
        colors.push("bg-border");
      } else if (isPending) {
        colors.push("bg-warning");
      } else if (post.scheduledAt) {
        colors.push("bg-info");
      } else {
        colors.push("bg-border");
      }
    }

    return colors;
  };

  const socialMediaIcons = getSocialMediaPostIcons(post);
  const postStatus = getPostStatus();

  // Group by brand
  const postsByBrand = socialMediaIcons.reduce((acc, socialMedia) => {
    if (!acc[socialMedia.brand]) {
      acc[socialMedia.brand] = [];
    }
    acc[socialMedia.brand].push(socialMedia);
    return acc;
  }, {} as Record<string, typeof socialMediaIcons>);

  return (
    <Link
      href={`/dashboard/posts/${post.id}`}
      className={cn(
        "flex flex-col gap-1 p-1 rounded cursor-pointer",
        isCurrentDay
          ? "bg-card hover:bg-card/50"
          : "bg-accent hover:bg-accent/50",
        "transition-colors"
      )}
    >
      {/* Post type icon and status dot */}
      <div className="flex items-center justify-between gap-2 flex-1">
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <div className="shrink-0">{getPostTypeIcon(post.postType)}</div>
          <span className="text-xs font-medium truncate">
            {post.description}
          </span>
        </div>
        <div
          className={cn(
            "w-2 h-2 rounded-full flex-shrink-0 flex overflow-hidden"
          )}
        >
          {postStatus.map((color) => {
            return <div key={color} className={cn("flex-1 h-full", color)} />;
          })}
        </div>
      </div>

      {/* Brand rows with social media platforms */}
      {Object.entries(postsByBrand).map(([brandName, socialMedias]) => (
        <div
          key={brandName}
          className="flex items-center justify-between gap-1"
        >
          <span className="text-xs text-muted-foreground min-w-0 truncate">
            {brandName}
          </span>
          <div className="flex items-center gap-0.5">
            {socialMedias.map((socialMedia) => (
              <div key={socialMedia.id} className="flex items-center gap-0.5">
                {socialMedia.icon && (
                  <socialMedia.icon className="h-2.5 w-2.5" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </Link>
  );
}
