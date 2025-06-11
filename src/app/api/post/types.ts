import {
  Post,
  SocialMediaIntegration,
  SocialMediaPost,
  Brand,
  File,
} from "@/generated/prisma";

export type PostWithRelations = Post & {
  socialMediaPosts: SocialMediaPostWithRelations[];
  images: File[];
  video: File | null;
  videoCover: File | null;
};

export type SocialMediaPostWithRelations = SocialMediaPost & {
  socialMediaIntegration: SocialMediaIntegration & {
    brand?: Brand | null;
  };
};
