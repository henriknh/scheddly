import {
  Post,
  SocialMediaIntegration,
  SocialMediaPost,
  Brand,
} from "@/generated/prisma";

export type PostWithRelations = Post & {
  socialMediaPosts: SocialMediaPostWithRelations[];
};

export type SocialMediaPostWithRelations = SocialMediaPost & {
  socialMediaIntegration: SocialMediaIntegration & {
    brand?: Brand | null;
  };
};
