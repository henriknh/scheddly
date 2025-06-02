"use client";

import { PostWithRelations } from "@/app/api/post/types";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brand,
  Post,
  PostType,
  SocialMedia,
  SocialMediaPost,
} from "@/generated/prisma";
import { formatDate, formatDateAgo } from "@/lib/format-date";
import { getPostTypeName } from "@/lib/post-type-name";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { cn } from "@/lib/utils";
import { ImageIcon, TextIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { PostsGridImageCarousel } from "./PostsGridImageCarousel";
import { useRef, useState } from "react";
import { useEffect } from "react";

interface PostGridProps {
  posts: PostWithRelations[];
  brands: Brand[];
}

export function PostGrid({ posts, brands }: PostGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<number>(0);
  const [cellSize, setCellSize] = useState<number>(300);

  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;

    const observer = new ResizeObserver(() => {
      const columns = Math.max(1, Math.floor(grid.offsetWidth / 300));
      setColumns(columns);
      const cellSize = grid.offsetWidth / columns;
      setCellSize(cellSize);
    });
    observer.observe(grid);
    return () => {
      observer.disconnect();
    };
  }, [setColumns, columns]);

  const updateQueryParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const getPostTypeBadge = (post: Post) => {
    const icon = {
      [PostType.TEXT]: <TextIcon className="h-4 w-4" />,
      [PostType.IMAGE]: <ImageIcon className="h-4 w-4" />,
      [PostType.VIDEO]: <VideoIcon className="h-4 w-4" />,
    };

    return (
      <Badge variant="secondary" className="h-5 inline-flex items-center gap-1">
        <span className="overflow-hidden h-4 w-4">{icon[post.postType]}</span>

        {getPostTypeName(post.postType)}
      </Badge>
    );
  };

  const getCreatedAtBadge = (post: Post) => {
    return <Badge variant="secondary">{formatDateAgo(post.createdAt)}</Badge>;
  };

  const getStatusBadge = (
    post: Post & { socialMediaPosts: SocialMediaPost[] }
  ) => {
    const socialMediaPosts = post.socialMediaPosts || [];

    const hasFailed = socialMediaPosts.some(
      (post: SocialMediaPost) => post.failedAt || post.failedReason
    );
    if (hasFailed) {
      const failedAt = socialMediaPosts.map(
        (post: SocialMediaPost) => post.failedAt
      );
      const lastFailedAt = failedAt.sort((a, b) => {
        if (a && b) {
          return a.getTime() - b.getTime();
        } else if (a) {
          return 1;
        } else if (b) {
          return -1;
        }
        return 0;
      })[0];

      return (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="destructive">Failed</Badge>
          </TooltipTrigger>
          <TooltipContent>
            {lastFailedAt ? (
              <>
                The post has failed to be posted at {formatDate(lastFailedAt)}
              </>
            ) : (
              <>The post has failed to be posted</>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    const allPosted = socialMediaPosts.every(
      (post: SocialMediaPost) => post.postedAt
    );
    if (allPosted) {
      const postedAt = socialMediaPosts.map(
        (post: SocialMediaPost) => post.postedAt
      );
      const lastPostedAt = postedAt.sort((a, b) => {
        if (a && b) {
          return a.getTime() - b.getTime();
        } else if (a) {
          return 1;
        } else if (b) {
          return -1;
        }
        return 0;
      })[0];

      return (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="success">Success</Badge>
          </TooltipTrigger>
          <TooltipContent>
            {lastPostedAt ? (
              <>All posts have been posted at {formatDate(lastPostedAt)}</>
            ) : (
              <>All posts have been posted</>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    if (post.scheduledAt) {
      const scheduledDate = new Date(post.scheduledAt);
      if (scheduledDate > new Date()) {
        return (
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="info">Scheduled</Badge>
            </TooltipTrigger>
            <TooltipContent>
              Scheduled for {formatDate(post.scheduledAt)}
            </TooltipContent>
          </Tooltip>
        );
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="warning" className="animate-pulse">
            Pending
          </Badge>
        </TooltipTrigger>
        <TooltipContent>The post is pending to be posted</TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Select
          value={searchParams.get("brandId") || "all"}
          onValueChange={(value) => updateQueryParams("brandId", value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("postType") || "all"}
          onValueChange={(value) => updateQueryParams("postType", value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All post types</SelectItem>
            {Object.values(PostType).map((type) => (
              <SelectItem key={type} value={type}>
                {getPostTypeName(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("socialMedia") || "all"}
          onValueChange={(value) => updateQueryParams("socialMedia", value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All platforms</SelectItem>
            {Object.values(SocialMedia)
              .filter((media) =>
                socialMediaPlatforms.some((platform) => platform.id === media)
              )
              .map((media) => (
                <SelectItem key={media} value={media}>
                  {
                    socialMediaPlatforms.find(
                      (platform) => platform.id === media
                    )?.name
                  }
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("status") || "all"}
          onValueChange={(value) => updateQueryParams("status", value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="posted">Posted</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        ref={ref}
        className="grid gap-4 transition-opacity duration-300"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          opacity: columns > 0 ? 1 : 0,
        }}
      >
        {posts.length > 0 ? (
          posts.map((post: PostWithRelations) => (
            <Link
              key={post.id}
              href={`/dashboard/posts/${post.id}`}
              className={cn(
                "col-span-1 row-span-1",
                post.postType === PostType.VIDEO ? "row-span-2" : "row-span-1"
              )}
              style={{
                height:
                  post.postType === PostType.VIDEO
                    ? `calc(${cellSize}px * 1.7777777778 + 1rem)`
                    : `calc(${cellSize}px * 0.8888888889)`,
              }}
            >
              <div className="group relative rounded-xl bg-card overflow-hidden border h-full">
                <div
                  className={cn(
                    "space-x-2 flex justify-between items-center",
                    post.postType === PostType.TEXT
                      ? "p-4 pb-3"
                      : "absolute left-4 top-4 right-4 z-10"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {getPostTypeBadge(post)}

                    {getCreatedAtBadge(post)}
                  </div>

                  {getStatusBadge(post)}
                </div>

                {post.postType === PostType.VIDEO && post.videoUrl && false && (
                  <video
                    src={`/api/file/${post.videoUrl}`}
                    className="rounded-xl w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}

                {post.postType === PostType.VIDEO && post.videoCoverUrl && (
                  <img
                    src={`/api/file/${post.videoCoverUrl}`}
                    alt={post.description}
                    className="rounded-xl w-full h-full object-cover"
                  />
                )}

                {post.postType === PostType.IMAGE &&
                  post.imageUrls.length > 0 && (
                    <PostsGridImageCarousel post={post} />
                  )}

                {post.postType === PostType.TEXT ? (
                  <div className="pb-4 px-4">
                    <div className="line-clamp-9">{post.description}</div>
                  </div>
                ) : (
                  post.description && (
                    <div className="absolute p-4 left-0 bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-card/80">
                      <div className="line-clamp-2">{post.description}</div>
                    </div>
                  )
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center">
            <p>No posts found</p>
          </div>
        )}
      </div>
    </div>
  );
}
