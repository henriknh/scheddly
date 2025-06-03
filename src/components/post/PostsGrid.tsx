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
import { Brand, Post, PostType, SocialMedia } from "@/generated/prisma";
import { formatDateAgo, formatDateIn, formatDateTime } from "@/lib/format-date";
import { getPostTypeName } from "@/lib/post-type-name";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ImageIcon, TextIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { PostsGridImageCarousel } from "./PostsGridImageCarousel";

interface PostGridProps {
  posts: PostWithRelations[];
  brands: Brand[];
  scheduledDates: Date[];
}

export function PostGrid({ posts, brands, scheduledDates }: PostGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<number>(0);
  const [cellSize, setCellSize] = useState<number>(300);

  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setDateFrom(
      searchParams.get("dateFrom")
        ? new Date(searchParams.get("dateFrom")!)
        : undefined
    );
    setDateTo(
      searchParams.get("dateTo")
        ? new Date(searchParams.get("dateTo")!)
        : undefined
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const updateQueryParam = (key: string, value: string | null) => {
    console.log(searchParams.toString());

    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    const updateQueryParams = (
      params: Record<string, string | null | undefined>
    ) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });
      router.push(`?${newParams.toString()}`);
    };

    if (dateFrom && dateTo) {
      updateQueryParams({
        dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
        dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
      });
    } else {
      updateQueryParams({
        dateFrom: undefined,
        dateTo: undefined,
      });
    }
  }, [dateFrom, dateTo, router, searchParams]);

  const getPostTypeBadge = (post: Post) => {
    const icon = {
      [PostType.TEXT]: <TextIcon className="h-4 w-4" />,
      [PostType.IMAGE]: <ImageIcon className="h-4 w-4" />,
      [PostType.VIDEO]: <VideoIcon className="h-4 w-4" />,
    };

    return (
      <Badge
        variant="outline"
        className="h-5 inline-flex items-center gap-1 bg-secondary"
      >
        <span className="overflow-hidden h-4 w-4">{icon[post.postType]}</span>

        {getPostTypeName(post.postType)}
      </Badge>
    );
  };

  const getCreatedAtBadge = (post: Post) => {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="outline" className="bg-secondary">
            {formatDateAgo(post.createdAt)}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          Created at {formatDateTime(post.createdAt)}
        </TooltipContent>
      </Tooltip>
    );
  };

  const getStatusBadge = (post: Post) => {
    if (post.failedAt) {
      return (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="destructive">Failed</Badge>
          </TooltipTrigger>
          <TooltipContent>
            The post has failed to be posted at {formatDateTime(post.failedAt)}
          </TooltipContent>
        </Tooltip>
      );
    }

    if (post.postedAt) {
      return (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="success">Success</Badge>
          </TooltipTrigger>
          <TooltipContent>
            The post has been posted at {formatDateTime(post.postedAt)}
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
              <Badge variant="info">{formatDateIn(post.scheduledAt)}</Badge>
            </TooltipTrigger>
            <TooltipContent>
              Scheduled for {formatDateTime(post.scheduledAt)}
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

  const next30Days = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }
    return dates;
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Select
          value={searchParams.get("brandId") || "all"}
          onValueChange={(value) => updateQueryParam("brandId", value)}
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
          onValueChange={(value) => updateQueryParam("postType", value)}
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
          onValueChange={(value) => updateQueryParam("socialMedia", value)}
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
          onValueChange={(value) => updateQueryParam("status", value)}
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[240px]">
              <CalendarIcon className="w-4 h-4" />
              <span className="flex-1">
                {searchParams.get("dateFrom") && searchParams.get("dateTo")
                  ? format(
                      new Date(searchParams.get("dateFrom")!),
                      "yyyy-MM-dd"
                    ) +
                    " - " +
                    format(new Date(searchParams.get("dateTo")!), "yyyy-MM-dd")
                  : "Select date range"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Calendar
              mode="range"
              selected={{
                from: dateFrom,
                to: dateTo,
              }}
              onSelect={(date) => {
                setDateFrom(date?.from || undefined);
                setDateTo(date?.to || undefined);
              }}
            />

            <div className="w-full px-3 pb-3">
              <Button
                variant="outline"
                className="w-full"
                disabled={!dateFrom && !dateTo}
                onClick={() => {
                  setDateFrom(undefined);
                  setDateTo(undefined);
                }}
              >
                Clear
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex justify-between gap-2">
        {next30Days.map((date, index) => {
          const prevDate = new Date(date);
          prevDate.setDate(prevDate.getDate() - 1);

          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);

          const isNewMonth = date.getMonth() !== prevDate.getMonth();

          const dateHasScheduledPosts = scheduledDates.some((scheduledDate) => {
            return (
              scheduledDate.getDate() === date.getDate() &&
              scheduledDate.getMonth() === date.getMonth() &&
              scheduledDate.getFullYear() === date.getFullYear()
            );
          });

          return (
            <div key={date.toISOString()} className="flex justify-between">
              <div className="flex flex-col gap-1 justify-end">
                <div>
                  {isNewMonth || index === 0 ? format(date, "MMM") : null}
                </div>
                <Badge
                  key={date.toISOString()}
                  variant={dateHasScheduledPosts ? "info" : "outline"}
                  onClick={() => {
                    setDateFrom(date);
                    setDateTo(nextDate);
                  }}
                  className="cursor-pointer"
                >
                  {date.getDate()}
                </Badge>
              </div>
            </div>
          );
        })}
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
