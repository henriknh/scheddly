import { Brand } from "@/generated/prisma";
import { SocialMediaIntegrationWithRelations } from "@/app/api/social-media-integration/types";

export type BrandWithRelations = Brand & {
  socialMediaIntegrations: SocialMediaIntegrationWithRelations[];
};
