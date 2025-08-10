import { Brand, SocialMediaIntegration, XCommunity } from "@/generated/prisma";

export type SocialMediaIntegrationWithRelations = SocialMediaIntegration & {
  brand?: Brand | null;
  xCommunities?: XCommunity[] | null;
};
