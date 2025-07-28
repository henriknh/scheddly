"use client";

import { PostWithRelations } from "@/app/api/post/types";
import { PostType } from "@/generated/prisma";
import { getSocialMediaPlatform } from "@/lib/social-media-platforms";
import { cn } from "@/lib/utils";
import { ImageIcon, TextIcon, VideoIcon } from "lucide-react";
import Link from "next/link";

interface PostCellProps {
  post: PostWithRelations;
}

export function PostCell({ post }: PostCellProps) {
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

  const getPostStatus = () => {
    const socialMediaIcons = getSocialMediaPostIcons(post);
    const hasFailed = socialMediaIcons.some((sm) => sm.failed);
    const hasPosted = socialMediaIcons.some((sm) => sm.posted);
    const hasPending = socialMediaIcons.some((sm) => !sm.failed && !sm.posted);

    // Check if scheduled time has passed
    const isScheduledTimePassed =
      post.scheduledAt && new Date(post.scheduledAt) < new Date();

    if (hasFailed && hasPosted) {
      return { status: "mixed", color: "bg-warning" };
    } else if (hasFailed) {
      return { status: "failed", color: "bg-destructive" };
    } else if (hasPosted && !hasPending) {
      return { status: "success", color: "bg-success" };
    } else if (isScheduledTimePassed && hasPending) {
      return { status: "overdue", color: "bg-warning" };
    } else if (post.scheduledAt) {
      return { status: "scheduled", color: "bg-info" };
    } else {
      return { status: "pending", color: "bg-warning" };
    }
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
        "bg-accent hover:bg-accent/50 transition-colors"
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
          className={cn("w-2 h-2 rounded-full flex-shrink-0", postStatus.color)}
        />
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
