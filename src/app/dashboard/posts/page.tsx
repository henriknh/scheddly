"use server";

import { getBrands } from "@/app/api/brand/get-brands";
import { getPosts, GetPostsFilter } from "@/app/api/post/get-posts";
import { Header } from "@/components/common/Header";
import { PostGrid } from "@/components/posts/PostsGrid";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function PostsPage({ searchParams }: Props) {
  const { status, brandId, postType, socialMedia } =
    (await searchParams) as GetPostsFilter;

  const posts = await getPosts({
    status,
    brandId,
    postType,
    socialMedia,
  });

  const brands = await getBrands();

  return (
    <div className="space-y-4">
      <Header>Posts</Header>
      <PostGrid posts={posts} brands={brands} />
    </div>
  );
}
