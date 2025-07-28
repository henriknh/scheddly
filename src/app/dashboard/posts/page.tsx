"use server";

import { getBrands } from "@/app/api/brand/get-brands";
import { getPosts, GetPostsFilter } from "@/app/api/post/get-posts";
import { WeeklyCalendar } from "@/components/posts/WeeklyCalendar";

type PostsProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function PostsPage({ searchParams }: PostsProps) {
  const { status, brandId, postType, socialMedia, dateFrom, dateTo } =
    (await searchParams) as GetPostsFilter;

  const posts = await getPosts({
    status,
    brandId,
    postType,
    socialMedia,
    dateFrom,
    dateTo,
  });

  const brands = await getBrands();

  return <WeeklyCalendar posts={posts} brands={brands} />;
}
