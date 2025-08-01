import { Brand } from "@/generated/prisma";

export type BrandWithRelations = Brand & {
  socialMediaIntegrations: { socialMedia: string }[];
};
