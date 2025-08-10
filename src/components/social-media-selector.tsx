"use client";

import { SocialMediaPostParams } from "@/app/api/post/create-post";
import { SocialMediaIntegrationWithRelations } from "@/app/api/social-media-integration/types";
import { Brand } from "@/generated/prisma";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { SocialMediaSelectorCard } from "./social-media-selector/SocialMediaSelectorCard";

interface SocialMediaSelectorProps {
  socialMediaPosts?: SocialMediaPostParams[];
  integrations: SocialMediaIntegrationWithRelations[];
  onChangeSocialMediaPosts: (socialMediaData: SocialMediaPostParams[]) => void;
  postType?: "TEXT" | "IMAGE" | "VIDEO";
}

export function SocialMediaSelector({
  socialMediaPosts,
  onChangeSocialMediaPosts,
  integrations,
  postType,
}: SocialMediaSelectorProps) {
  // Group integrations by brand
  const integrationsByBrand = integrations.reduce((acc, integration) => {
    const brandId = integration.brand?.id || "no-brand";
    if (!acc[brandId]) {
      acc[brandId] = {
        brand: integration.brand || null,
        integrations: [],
      };
    }
    acc[brandId].integrations.push(integration);
    return acc;
  }, {} as Record<string, { brand: Brand | null; integrations: typeof integrations }>);

  // Filter integrations based on post type if specified
  const filteredIntegrationsByBrand = Object.entries(
    integrationsByBrand
  ).reduce((acc, [brandId, data]) => {
    const filteredIntegrations = postType
      ? data.integrations.filter((integration) => {
          const platform = socialMediaPlatforms.find(
            (p) => p.id === integration.socialMedia
          );
          return platform?.supportsPostTypes.includes(postType);
        })
      : data.integrations;

    if (filteredIntegrations.length > 0) {
      acc[brandId] = {
        brand: data.brand,
        integrations: filteredIntegrations,
      };
    }
    return acc;
  }, {} as Record<string, { brand: Brand | null; integrations: typeof integrations }>);

  return (
    <div className="space-y-4">
      {Object.entries(filteredIntegrationsByBrand).map(([brandId, data]) => {
        const integrationsByBrand = data.integrations.filter(
          (integration) => integration.brand?.id === data.brand?.id
        );

        // const allIntegrationsSelected = integrationsByBrand.every(
        //   (integration) => selectedIntegrationIds.includes(integration.id)
        // );

        return (
          <div key={brandId} className="space-y-4">
            <div className="flex gap-2 items-center">
              {data.brand?.name || "No Brand"}
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (allIntegrationsSelected) {
                    onSelectionChange(
                      selectedIntegrationIds.filter(
                        (id) =>
                          !integrationsByBrand.some(
                            (integration) => integration.id === id
                          )
                      )
                    );
                  } else {
                    onSelectionChange([
                      ...selectedIntegrationIds,
                      ...integrationsByBrand.map(
                        (integration) => integration.id
                      ),
                    ]);
                  }
                }}
              >
                {allIntegrationsSelected ? "Deselect all" : "Select all"}
              </Button> */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {integrationsByBrand.map((integration) => {
                return (
                  <SocialMediaSelectorCard
                    key={integration.id}
                    integration={integration}
                    socialMediaPost={socialMediaPosts?.find(
                      (data) =>
                        data.socialMediaIntegration.id === integration.id
                    )}
                    onChange={(socialMediaPost) => {
                      if (!socialMediaPost) {
                        const updatedSocialMediaPosts =
                          socialMediaPosts?.filter(
                            (data) =>
                              data.socialMediaIntegration.id !== integration.id
                          );

                        onChangeSocialMediaPosts(updatedSocialMediaPosts || []);
                      } else {
                        const hasSocialMediaPost = socialMediaPosts?.find(
                          (data) =>
                            data.socialMediaIntegration.id === integration.id
                        );

                        if (!hasSocialMediaPost) {
                          const updatedSocialMediaPosts = [
                            ...(socialMediaPosts || []),
                            socialMediaPost,
                          ];
                          onChangeSocialMediaPosts(updatedSocialMediaPosts);
                        } else {
                          const updatedSocialMediaPosts = socialMediaPosts?.map(
                            (data) =>
                              data.socialMediaIntegration.id === integration.id
                                ? socialMediaPost
                                : data
                          );
                          onChangeSocialMediaPosts(
                            updatedSocialMediaPosts || []
                          );
                        }
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
