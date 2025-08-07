"use server";

import { getBrands } from "@/app/api/brand/get-brands";
import { getPosts, GetPostsFilter } from "@/app/api/post/get-posts";
import { WeeklyCalendar } from "@/components/posts/WeeklyCalendar";
import { Breadcrumb } from "@/components/common/breadcrumb";

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
    archived: false,
  });

  const brands = await getBrands();

  return (
    <div>
      <Breadcrumb label="Posts" href="/dashboard/posts" />
      <WeeklyCalendar posts={posts} brands={brands} />
    </div>
  );
}
