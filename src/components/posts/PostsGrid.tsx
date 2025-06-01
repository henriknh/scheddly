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

  const getStatusBadge = (
    post: Post & { socialMediaPosts: SocialMediaPost[] }
  ) => {
    const socialMediaPosts = post.socialMediaPosts || [];

    if (socialMediaPosts.length === 0) {
      return <Badge variant="secondary">Draft</Badge>;
    }

    const hasFailed = socialMediaPosts.some((p: SocialMediaPost) => p.failedAt);
    const allPosted = socialMediaPosts.every(
      (p: SocialMediaPost) => p.postedAt
    );
    const somePosted = socialMediaPosts.some(
      (p: SocialMediaPost) => p.postedAt
    );

    if (hasFailed) {
      return <Badge variant="destructive">Error</Badge>;
    }

    if (allPosted) {
      return <Badge variant="success">Success</Badge>;
    }

    if (somePosted) {
      return <Badge variant="warning">Partial</Badge>;
    }

    if (post.scheduledAt) {
      const scheduledDate = new Date(post.scheduledAt);
      if (scheduledDate > new Date()) {
        return <Badge variant="secondary">Scheduled</Badge>;
      }
    }

    return <Badge variant="secondary">Pending</Badge>;
  };

  console.log(posts);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              <div className="group relative rounded-xl bg-red-500 overflow-hidden border h-full">
                <div
                  className={cn(
                    "space-x-2",
                    post.postType === PostType.TEXT
                      ? "flex justify-end p-4"
                      : "absolute top-4 right-4"
                  )}
                >
                  <Badge variant="secondary" className="space-x-1">
                    {formatDateToString(post.createdAt)}
                  </Badge>

                  {getStatusBadge(post)}
                </div>

                {post.postType === PostType.VIDEO && (
                  <video
                    src={post.videoUrl || ""}
                    className="rounded-xl w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
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
