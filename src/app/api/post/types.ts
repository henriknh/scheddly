import {
  Post,
  SocialMediaIntegration,
  SocialMediaPost,
} from "@/generated/prisma";

export type PostWithRelations = Post & {
  socialMediaPosts: (SocialMediaPost & {
    socialMediaIntegration: SocialMediaIntegration;
  })[];
};
