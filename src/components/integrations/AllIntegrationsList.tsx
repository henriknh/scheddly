"use client";

import { BrandWithRelations } from "@/app/api/brand/types";
import { SocialMediaIntegrationWithRelations } from "@/app/api/social-media-integration/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { GroupedIntegrationsList } from "./GroupedIntegrationsList";
import { IntegrationsHeader } from "./IntegrationsHeader";

interface AllIntegrationsListProps {
  brands: BrandWithRelations[];
  integrations: SocialMediaIntegrationWithRelations[];
}

export function AllIntegrationsList({
  brands,
  integrations,
}: AllIntegrationsListProps) {
  const integrationsByBrand = integrations.reduce((acc, integration) => {
    const brandId = integration.brand?.id || "unconnected";
    if (!acc[brandId]) {
      acc[brandId] = [];
    }
    acc[brandId].push(integration);
    return acc;
  }, {} as Record<string, typeof integrations>);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Integrations connect your social media accounts to Scheddly. Add your
        Facebook, Instagram, LinkedIn, and other accounts to schedule and manage
        posts across all your platforms.
      </p>

      <IntegrationsHeader />

      {/* Connected integrations grouped by brand */}
      {brands.map((brand) => {
        const brandIntegrations = integrationsByBrand[brand.id] || [];

        return (
          brandIntegrations.length > 0 && (
            <Card key={brand.id}>
              <CardHeader>
                <CardTitle>{brand.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <GroupedIntegrationsList
                  integrations={brandIntegrations}
                  brands={brands}
                />
              </CardContent>
            </Card>
          )
        );
      })}

      {integrationsByBrand["unconnected"] &&
        integrationsByBrand["unconnected"].length > 0 && (
          <div className="px-8">
            <GroupedIntegrationsList
              integrations={integrationsByBrand["unconnected"]}
              brands={brands}
            />
          </div>
        )}
    </div>
  );
}
