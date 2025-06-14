"use client";

import { PostWithRelations } from "@/app/api/post/types";
import { SocialMediaIntegrationWithRelations } from "@/app/api/social-media-integration/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
  SocialMediaIntegration,
} from "@/generated/prisma";
import { formatDateIn, formatDateTime } from "@/lib/format-date";
import { getPostTypeName } from "@/lib/post-type-name";
import {
  getSocialMediaPlatform,
  socialMediaPlatforms,
} from "@/lib/social-media-platforms";
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
  const [daysToShow, setDaysToShow] = useState<number>(30);

  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

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
      setDaysToShow(Math.floor(grid.offsetWidth / 46));
    });
    observer.observe(grid);
    return () => {
      observer.disconnect();
    };
  }, [setColumns, columns]);

  const updateQueryParam = (key: string, value: string | null) => {
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

  const getStatusBadge = (post: PostWithRelations) => {
    // Aggregate status from socialMediaPosts
    const failed = post.socialMediaPosts.some((smp) => smp.failedAt);
    const posted = post.socialMediaPosts.some((smp) => smp.postedAt);
    const scheduled =
      post.scheduledAt && new Date(post.scheduledAt) > new Date();

    // Get latest timestamps
    const latestFailedAt = post.socialMediaPosts
      .filter((smp) => smp.failedAt)
      .sort(
        (a, b) =>
          new Date(b.failedAt!).getTime() - new Date(a.failedAt!).getTime()
      )[0]?.failedAt;

    const latestPostedAt = post.socialMediaPosts
      .filter((smp) => smp.postedAt)
      .sort(
        (a, b) =>
          new Date(b.postedAt!).getTime() - new Date(a.postedAt!).getTime()
      )[0]?.postedAt;

    if (failed) {
      return (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="destructive" className="text-nowrap">
              Failed
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col gap-1">
              <div>Failed to post at {formatDateTime(latestFailedAt!)}</div>
              <div>Created at {formatDateTime(post.createdAt)}</div>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }
    if (posted) {
      return (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="success" className="text-nowrap">
              Success
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col gap-1">
              <div>Posted at {formatDateTime(latestPostedAt!)}</div>
              <div>Created at {formatDateTime(post.createdAt)}</div>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }
    if (scheduled) {
      return (
        <Tooltip>
          <TooltipTrigger>
            <Badge className="text-nowrap">
              {formatDateIn(post.scheduledAt!)}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col gap-1">
              <div>Scheduled for {formatDateTime(post.scheduledAt!)}</div>
              <div>Created at {formatDateTime(post.createdAt)}</div>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }
    return (
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="warning" className="text-nowrap animate-pulse">
            Pending
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col gap-1">
            <div>The post is pending to be posted</div>
            <div>Created at {formatDateTime(post.createdAt)}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  };

  const getBrandBadge = (post: PostWithRelations) => {
    const socialMediaIntegrations = post.socialMediaPosts.map(
      (socialMediaPost) => {
        return socialMediaPost?.socialMediaIntegration;
      }
    );

    const groupedSocialMediaIntegrationsByBrand =
      socialMediaIntegrations.reduce(
        (
          acc: Record<
            string,
            { brand: Brand; socialMediaIntegrations: SocialMediaIntegration[] }
          >,
          socialMediaIntegration: SocialMediaIntegrationWithRelations
        ) => {
          const brand = socialMediaIntegration?.brand;

          if (!brand) {
            return acc;
          }

          if (!acc[brand.id]) {
            acc[brand.id] = {
              brand: brand,
              socialMediaIntegrations: [],
            };
          }

          acc[brand.id].socialMediaIntegrations.push(socialMediaIntegration);

          return acc;
        },
        {}
      );

    if (Object.keys(groupedSocialMediaIntegrationsByBrand).length === 0) {
      return null;
    }

    return (
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="outline" className="bg-secondary">
            {Object.values(groupedSocialMediaIntegrationsByBrand)[0].brand.name}
            {Object.keys(groupedSocialMediaIntegrationsByBrand).length > 1
              ? `+${
                  Object.keys(groupedSocialMediaIntegrationsByBrand).length - 1
                }`
              : ""}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col gap-2">
            {Object.values(groupedSocialMediaIntegrationsByBrand).map(
              (group) => {
                return (
                  <div key={group.brand.id} className="flex flex-col gap-1">
                    <div>{group.brand.name}</div>
                    <div className="flex items-center gap-1">
                      {group.socialMediaIntegrations.map((s) => {
                        const platform = getSocialMediaPlatform(s.socialMedia);
                        if (!platform) return null;
                        return <platform.Icon key={s.id} className="h-4 w-4" />;
                      })}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </TooltipContent>
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
    <div
      className="space-y-4 transition-opacity duration-75"
      style={{
        opacity: columns > 0 ? 1 : 0,
      }}
    >
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
                      format(
                        new Date(searchParams.get("dateTo")!),
                        "yyyy-MM-dd"
                      )
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

        <div className="flex justify-between">
          {next30Days.slice(0, daysToShow).map((date, index) => {
            const prevDate = new Date(date);
            prevDate.setDate(prevDate.getDate() - 1);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const isNewMonth = date.getMonth() !== prevDate.getMonth();

            const dateHasScheduledPosts = scheduledDates.some(
              (scheduledDate) => {
                return (
                  scheduledDate.getDate() === date.getDate() &&
                  scheduledDate.getMonth() === date.getMonth() &&
                  scheduledDate.getFullYear() === date.getFullYear()
                );
              }
            );

            return (
              <div
                key={date.toISOString()}
                className="flex flex-col gap-1 justify-start"
              >
                <Badge
                  key={date.toISOString()}
                  variant={dateHasScheduledPosts ? "default" : "outline"}
                  onClick={() => {
                    setDateFrom(date);
                    setDateTo(nextDate);
                  }}
                  className="cursor-pointer flex items-center justify-center w-9"
                >
                  {date.getDate()}
                </Badge>
                <div className="text-xs">
                  {isNewMonth || index === 0 ? format(date, "MMM") : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        ref={ref}
        className="grid gap-8"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
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
                    ? `calc(${cellSize}px * 1.7777777778 + 2rem)`
                    : `calc(${cellSize}px * 0.8888888889)`,
              }}
            >
              <Card className="group relative h-full flex flex-col overflow-hidden hover:bg-secondary transition-colors">
                <CardHeader className="py-4 px-6 flex flex-row justify-between items-center z-10">
                  {getPostTypeBadge(post)}
                  {getStatusBadge(post)}
                </CardHeader>

                {post.postType === PostType.VIDEO && post.videoCover && (
                  <img
                    src={`/api/file/${post.videoCover.id}`}
                    alt={post.description}
                    className="absolute inset-0 rounded-xl w-full h-full object-cover"
                  />
                )}

                {post.postType === PostType.IMAGE &&
                  post.images?.length > 0 && (
                    <div className="absolute inset-0">
                      <PostsGridImageCarousel post={post} />
                    </div>
                  )}

                <CardContent className="flex-1 px-6 z-10 py-0">
                  {post.postType === PostType.TEXT && (
                    <div className="line-clamp-6">{post.description}</div>
                  )}
                </CardContent>

                <CardFooter className="py-4 px-6 flex flex-row justify-between items-center z-10">
                  {getBrandBadge(post)}
                </CardFooter>
              </Card>
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
