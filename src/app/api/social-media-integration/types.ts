import { Brand, SocialMediaIntegration } from "@/generated/prisma";

export type SocialMediaIntegrationWithRelations = SocialMediaIntegration & {
  brand?: Brand | null;
};
