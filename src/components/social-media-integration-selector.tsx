"use client";

import { Brand, SocialMediaIntegration } from "@/generated/prisma";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getSocialMediaIntegrations } from "@/app/api/social-media-integration/social-media-integration";
import { Skeleton } from "@/components/ui/skeleton";

interface SocialMediaIntegrationSelectorProps {
  onSelectionChange: (integrationIds: string[]) => void;
  selectedIntegrationIds?: string[];
  postType?: "TEXT" | "IMAGE" | "VIDEO";
}

export function SocialMediaIntegrationSelector({
  onSelectionChange,
  selectedIntegrationIds = [],
  postType,
}: SocialMediaIntegrationSelectorProps) {
  const [integrations, setIntegrations] = useState<
    (SocialMediaIntegration & {
      brand?: Brand | null;
    })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const integrationsData = await getSocialMediaIntegrations();
        setIntegrations(integrationsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleIntegrationChange = (integrationId: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedIntegrationIds, integrationId]
      : selectedIntegrationIds.filter((id) => id !== integrationId);
    onSelectionChange(newSelection);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              {[1, 2].map((j) => (
                <div key={j} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

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
      {Object.entries(filteredIntegrationsByBrand).map(([brandId, data]) => (
        <div key={brandId} className="space-y-2">
          <Label className="text-sm font-medium">
            {data.brand?.name || "No Brand"}
          </Label>
          <div className="space-y-2">
            {data.integrations.map((integration) => {
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
          </div>
        </div>
      ))}
    </div>
  );
}
