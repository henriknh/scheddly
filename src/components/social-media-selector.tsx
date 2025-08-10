"use client";

import { Brand, SocialMediaIntegration } from "@/generated/prisma";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { UserAvatar } from "./common/UserAvatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";

interface SocialMediaSelectorProps {
  onSelectionChange: (integrationIds: string[]) => void;
  selectedIntegrationIds?: string[];
  postType?: "TEXT" | "IMAGE" | "VIDEO";
  integrations: (SocialMediaIntegration & {
    brand?: Brand | null;
  })[];
}

export function SocialMediaSelector({
  onSelectionChange,
  selectedIntegrationIds = [],
  postType,
  integrations,
}: SocialMediaSelectorProps) {
  const handleIntegrationChange = (integrationId: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedIntegrationIds, integrationId]
      : selectedIntegrationIds.filter((id) => id !== integrationId);
    onSelectionChange(newSelection);
  };

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

        const allIntegrationsSelected = integrationsByBrand.every(
          (integration) => selectedIntegrationIds.includes(integration.id)
        );

        return (
          <div key={brandId} className="space-y-4">
            <div className="flex gap-2 items-center">
              {data.brand?.name || "No Brand"}
              <Button
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
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {integrationsByBrand.map((integration) => {
                const platform = socialMediaPlatforms.find(
                  (p) => p.id === integration.socialMedia
                );
                if (!platform) return null;

                return (
                  <Card
                    key={integration.id}
                    onClick={() =>
                      handleIntegrationChange(
                        integration.id,
                        !selectedIntegrationIds.includes(integration.id)
                      )
                    }
                  >
                    <CardHeader>
                      <CardTitle>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <div className="text-base font-medium flex items-center gap-2">
                                <platform.Icon className="h-4 w-4" />
                                <span>{platform.name}</span>
                              </div>
                              {integration.accountUsername && (
                                <span className="text-xs opacity-70 flex items-center gap-2">
                                  <UserAvatar
                                    src={
                                      integration.accountAvatarUrl || undefined
                                    }
                                  />

                                  {integration.accountName}
                                </span>
                              )}
                            </div>
                          </div>

                          <div>
                            <Checkbox
                              checked={selectedIntegrationIds.includes(
                                integration.id
                              )}
                              onCheckedChange={() =>
                                handleIntegrationChange(
                                  integration.id,
                                  !selectedIntegrationIds.includes(
                                    integration.id
                                  )
                                )
                              }
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
