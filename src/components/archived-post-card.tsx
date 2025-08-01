"use client";

import { PostWithRelations } from "@/app/api/post/types";
import { PostType } from "@/generated/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { format } from "date-fns";
import { ImageIcon, TextIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { ArchivePostButton } from "./archive-post-button";

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

interface ArchivedPostCardProps {
  post: PostWithRelations;
}

export function ArchivedPostCard({ post }: ArchivedPostCardProps) {
  const platforms = getPlatforms(post);
  const brand = post.socialMediaPosts[0]?.socialMediaIntegration?.brand;

  return (
    <Link href={`/dashboard/posts/${post.id}`} className="block">
      <Card className="hover:bg-secondary transition-colors cursor-pointer h-full">
        <CardHeader>
          <CardTitle>
            <div className="flex items-start gap-2">
              <div className="shrink-0 mt-0.5">
                {getPostTypeIcon(post.postType)}
              </div>
              <p className="text-base font-normal text-muted-foreground line-clamp-3">
                {post.description}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex  items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div>{brand ? brand.name : "No Brand"}</div>

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

            <div className="flex items-center gap-4">
              {post.archivedAt ? (
                <span className="text-sm text-muted-foreground">
                  Archived at:{" "}
                  {format(new Date(post.archivedAt), "MMM d, yyyy")}
                </span>
              ) : null}

              <ArchivePostButton post={post} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
