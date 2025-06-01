import {
  Brand,
  SocialMediaIntegration,
  SocialMediaIntegrationAccountInfo,
} from "@/generated/prisma";

export type SocialMediaIntegrationWithRelations = SocialMediaIntegration & {
  brand?: Brand | null;
  socialMediaIntegrationAccountInfo?: SocialMediaIntegrationAccountInfo | null;
};
