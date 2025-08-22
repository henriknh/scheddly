"use server";

import { getBrands } from "@/app/api/brand/get-brands";
import { getPosts, GetPostsFilter } from "@/app/api/post/get-posts";
import { WeeklyCalendar } from "@/components/posts/WeeklyCalendar";
import { formatDate } from "@/lib/format-date";
import { addDays, subDays } from "date-fns";

type PostsProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function PostsPage({ searchParams }: PostsProps) {
  const { status, brandId, postType, socialMedia, currentDate } =
    (await searchParams) as GetPostsFilter & { currentDate?: string };

  const posts = await getPosts({
    status,
    brandId,
    postType,
    socialMedia,
    dateFrom: currentDate
      ? formatDate(subDays(new Date(currentDate), 14))
      : formatDate(subDays(new Date(), 14)),
    dateTo: currentDate
      ? formatDate(addDays(new Date(currentDate), 21))
      : formatDate(addDays(new Date(), 21)),
    archived: false,
  });

  const brands = await getBrands();

  return <WeeklyCalendar posts={posts} brands={brands} />;
}
