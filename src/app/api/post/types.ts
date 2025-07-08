import { Post, SocialMediaPost, File, Brand } from "@/generated/prisma";

export type PostWithRelations = Post & {
  socialMediaPosts: SocialMediaPostWithRelations[];
  images: File[];
  video: File | null;
  videoCover: File | null;
};

export type SocialMediaPostWithRelations = SocialMediaPost & {
  brand: Brand;
};
