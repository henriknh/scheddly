"use server";

import { getBrands } from "@/app/api/brand/get-brands";
import { getPosts, GetPostsFilter } from "@/app/api/post/get-posts";
import { getScheduledDates } from "@/app/api/post/get-scheduled-dates";
import { Header } from "@/components/common/Header";
import { PostGrid } from "@/components/post/PostsGrid";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function PostsPage({ searchParams }: Props) {
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

  const scheduledDates = await getScheduledDates();

  console.log(posts);

  console.log(scheduledDates);

  const brands = await getBrands();

  return (
    <div className="space-y-4">
      <Header>Posts</Header>
      <PostGrid posts={posts} brands={brands} scheduledDates={scheduledDates} />
    </div>
  );
}
