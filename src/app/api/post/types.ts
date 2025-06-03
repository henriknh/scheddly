import {
  Post,
  SocialMediaIntegration,
  SocialMediaPost,
  Brand,
} from "@/generated/prisma";

export type PostWithRelations = Post & {
  socialMediaPosts: (SocialMediaPost & {
    socialMediaIntegration: SocialMediaIntegration & {
      brand: Brand;
    };
  })[];
};
