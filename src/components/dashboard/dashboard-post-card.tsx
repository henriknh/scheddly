"use client";

import { PostWithRelations } from "@/app/api/post/types";
import { PostType } from "@/generated/prisma";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { format } from "date-fns";
import { ImageIcon, TextIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function getPlatforms(post: PostWithRelations) {
  const platforms = Array.from(
    new Set(post.socialMediaPosts.map((smp) => smp.socialMedia))
  );
  return platforms;
}

function getPostTypeIcon(postType: PostType) {
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
}

function getPostStatus(post: PostWithRelations) {
  const hasFailed = post.socialMediaPosts.some(
    (socialMediaPost) => socialMediaPost.failedAt
  );
  const hasPosted = post.socialMediaPosts.some(
    (socialMediaPost) => socialMediaPost.postedAt
  );
  const isPending = post.scheduledAt && post.scheduledAt < new Date();

  if (hasFailed) return "Failed";
  if (hasPosted) return "Posted";
  if (isPending) return "Pending";
  if (post.scheduledAt) return "Scheduled";
  return "Draft";
}

function getStatusColor(status: string) {
  switch (status) {
    case "Failed":
      return "text-destructive";
    case "Posted":
      return "text-green-600";
    case "Pending":
      return "text-orange-600";
    case "Scheduled":
      return "text-blue-600";
    default:
      return "text-muted-foreground";
  }
}

interface DashboardPostCardProps {
  post: PostWithRelations;
}

export function DashboardPostCard({ post }: DashboardPostCardProps) {
  const platforms = getPlatforms(post);
  const brand = post.socialMediaPosts[0]?.socialMediaIntegration?.brand;
  const status = getPostStatus(post);
  const statusColor = getStatusColor(status);

  return (
    <Link href={`/dashboard/posts/${post.id}`} className="block">
      <Card className="hover:bg-secondary transition-colors cursor-pointer h-full">
        <CardHeader className="pb-3">
          <CardTitle>
            <div className="flex items-start gap-2">
              <div className="shrink-0 mt-0.5">
                {getPostTypeIcon(post.postType)}
              </div>
              <p className="text-sm font-normal text-muted-foreground line-clamp-2">
                {post.description}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">
                {brand ? brand.name : "No Brand"}
              </div>
              <div className="flex items-center gap-1">
                {platforms.map((platform) => {
                  const platformObj = socialMediaPlatforms.find(
                    (p) => p.id === platform
                  );
                  if (!platformObj) return null;
                  return (
                    <platformObj.Icon key={platform} className="w-4 h-4" />
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              {post.scheduledAt && (
                <span className="text-xs text-muted-foreground">
                  {format(new Date(post.scheduledAt), "HH:mm")}
                </span>
              )}
              <span className={`text-xs font-medium ${statusColor}`}>
                {status}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}