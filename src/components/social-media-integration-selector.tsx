"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Brand, SocialMediaIntegration } from "@/generated/prisma";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface SocialMediaIntegrationSelectorProps {
  onSelectionChange: (integrationIds: string[]) => void;
  selectedIntegrationIds?: string[];
  postType?: "TEXT" | "IMAGE" | "VIDEO";
  integrations: (SocialMediaIntegration & {
    brand?: Brand | null;
  })[];
}

export function SocialMediaIntegrationSelector({
  onSelectionChange,
  selectedIntegrationIds = [],
  postType,
  integrations,
}: SocialMediaIntegrationSelectorProps) {
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
          <Card key={brandId} className="space-y-2">
            <CardHeader className="flex flex-row gap-2 items-center space-x-2 space-y-0">
              <CardTitle className="space-x-4">
                {data.brand?.name || "No Brand"}
              </CardTitle>
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
                {allIntegrationsSelected ? "All selected" : "Select all"}
              </Button>
            </CardHeader>

            <CardContent className="flex flex-wrap gap-2">
              {integrationsByBrand.map((integration) => {
                const platform = socialMediaPlatforms.find(
                  (p) => p.id === integration.socialMedia
                );
                if (!platform) return null;

                return (
                  <div
                    key={integration.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={integration.id}
                      checked={selectedIntegrationIds.includes(integration.id)}
                      onCheckedChange={(checked) =>
                        handleIntegrationChange(
                          integration.id,
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor={integration.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Image
                        src={platform.icon}
                        alt={platform.name}
                        width={16}
                        height={16}
                        className="h-4 w-4"
                      />
                      {platform.name}
                    </Label>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
