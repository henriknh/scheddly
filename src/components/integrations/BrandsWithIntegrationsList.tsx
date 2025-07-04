"use client";

import { AddBrandModal } from "@/components/brands/AddBrandModal";
import { DeleteBrandDialog } from "@/components/brands/DeleteBrandDialog";
import { Header } from "@/components/common/Header";
import { AddIntegrationModal } from "@/components/integrations/AddIntegrationModal";
import { DeleteIntegrationDialog } from "@/components/integrations/DeleteIntegrationDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brand, SocialMediaIntegration } from "@/generated/prisma";
import { getSocialMediaApiFunctions } from "@/lib/social-media-api-functions/social-media-api-functions";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { UserAvatar } from "../common/UserAvatar";
import { RefreshIntegration } from "./RefreshIntegration";
import { EditBrandButton } from "./edit-brand-button";

interface BrandsWithIntegrationsListProps {
  brands: Brand[];
  integrations: (SocialMediaIntegration & {
    brand?: Brand | null;
  })[];
}

export function BrandsWithIntegrationsList({
  brands,
  integrations,
}: BrandsWithIntegrationsListProps) {
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);

  const integrationsByBrand = integrations.reduce((acc, integration) => {
    const brandId = integration.brand?.id || "no-brand";
    if (!acc[brandId]) {
      acc[brandId] = [];
    }
    acc[brandId].push(integration);
    return acc;
  }, {} as Record<string, typeof integrations>);

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <Header>Integrations</Header>
        <Button onClick={() => setIsAddBrandModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>

      {brands.map((brand) => {
        const brandIntegrations = integrationsByBrand[brand.id] || [];

        return (
          <Card key={brand.id} className="space-y-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <CardTitle>{brand.name}</CardTitle>
                <EditBrandButton brand={brand} />
                <DeleteBrandDialog brandId={brand.id} />
              </div>

              <AddIntegrationModal
                brandId={brand.id}
                integrations={brandIntegrations}
              />
            </CardHeader>
            <CardContent>
              <div>
                {brandIntegrations.length === 0 ? (
                  <p className="text-sm text-muted-foregroun col-span-3">
                    No integrations yet
                  </p>
                ) : (
                  brandIntegrations.map((integration) => {
                    const platform = socialMediaPlatforms.find(
                      (p) => p.id === integration.socialMedia
                    );
                    if (!platform) return null;

                    const socialMediaApiFunctions = getSocialMediaApiFunctions(
                      integration.socialMedia
                    );

                    const accountButton = (
                      <Button variant="ghost" asChild>
                        <Link
                          href={socialMediaApiFunctions.externalAccountUrl(
                            integration
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <UserAvatar
                            src={integration.accountAvatarUrl || undefined}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {integration.accountName}
                            </span>
                          </div>
                        </Link>
                      </Button>
                    );

                    return (
                      <div
                        key={integration.id}
                        className="flex items-center gap-2 space-y-2"
                      >
                        <div className="flex-1 flex items-center gap-2">
                          <platform.Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {platform.name}
                          </span>
                        </div>

                        <div className="flex-1 items-center gap-2">
                          {accountButton}

                          <RefreshIntegration integrationId={integration.id} />
                        </div>

                        <div className="flex justify-end">
                          <DeleteIntegrationDialog
                            integrationId={integration.id}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <AddBrandModal
        isOpen={isAddBrandModalOpen}
        onClose={() => setIsAddBrandModalOpen(false)}
      />
    </div>
  );
}
