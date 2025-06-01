"use client";

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
import { formatDateToString } from "@/lib/format-date-to-string";
import { getPostTypeName } from "@/lib/post-type-name";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { cn } from "@/lib/utils";
import { VideoIcon } from "lucide-react";
import { ImageIcon } from "lucide-react";
import { TextIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface PostGridProps {
  posts: (Post & {
    socialMediaPosts: SocialMediaPost[];
  })[];
  brands: Brand[];
}

export function PostGrid({ posts, brands }: PostGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    return (
      <Badge variant="secondary">{formatDateToString(post.createdAt)}</Badge>
    );
  };

  const getStatusBadge = (
    post: Post & { socialMediaPosts: SocialMediaPost[] }
  ) => {
    const socialMediaPosts = post.socialMediaPosts || [];

    const hasFailed = socialMediaPosts.some(
      (post: SocialMediaPost) => post.failedAt || post.failedReason
    );
    if (hasFailed) {
      return <Badge variant="destructive">Failed</Badge>;
    }

    const allPosted = socialMediaPosts.every(
      (post: SocialMediaPost) => post.postedAt
    );
    if (allPosted) {
      return <Badge variant="success">Success</Badge>;
    }

    if (post.scheduledAt) {
      const scheduledDate = new Date(post.scheduledAt);
      if (scheduledDate > new Date()) {
        return <Badge variant="info">Scheduled</Badge>;
      }
    }

    return (
      <Badge variant="warning" className="animate-pulse">
        Pending
      </Badge>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/dashboard/posts/${post.id}`}
              className={cn(
                "col-span-1",

                post.postType === PostType.VIDEO ? "row-span-2" : "row-span-1",
                post.postType === PostType.VIDEO
                  ? "aspect-video"
                  : "aspect-square"
              )}
            >
              <div className="group relative rounded-xl bg-card overflow-hidden border h-full">
                <div
                  className={cn(
                    "space-x-2 flex justify-between items-center",
                    post.postType === PostType.TEXT
                      ? "p-4 pb-2"
                      : "absolute left-4 top-4 right-4"
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
                    src={post.videoUrl || ""}
                    className="rounded-xl w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}

                {post.postType === PostType.VIDEO && post.videoCoverUrl && (
                  <img
                    src={post.videoCoverUrl}
                    alt={post.description}
                    className="rounded-xl w-full h-full object-cover"
                  />
                )}

                {post.postType === PostType.IMAGE && (
                  <img
                    src={post.imageUrls[0]}
                    alt={post.description}
                    className="rounded-xl w-full h-full object-cover"
                  />
                )}

                {post.postType === PostType.TEXT ? (
                  <div className="pb-4 px-4">
                    <div className="line-clamp-10">{post.description}</div>
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
