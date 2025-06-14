"use client";

import { AddBrandModal } from "@/components/brands/AddBrandModal";
import { DeleteBrandDialog } from "@/components/brands/DeleteBrandDialog";
import { EditBrandModal } from "@/components/brands/EditBrandModal";
import { Header } from "@/components/common/Header";
import { AddIntegrationModal } from "@/components/integrations/AddIntegrationModal";
import { DeleteIntegrationDialog } from "@/components/integrations/DeleteIntegrationDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brand, SocialMediaIntegration } from "@/generated/prisma";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { Pencil, Plus, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { updateAccountInfo } from "@/app/actions/social-media-integrations";
import { UserAvatar } from "../common/UserAvatar";

interface BrandsWithIntegrationsListProps {
  brands: Brand[];
  integrations: (SocialMediaIntegration & {
    brand?: Brand | null;
  })[];
}

interface EditBrandButtonProps {
  brand: Brand;
}

function EditBrandButton({ brand }: EditBrandButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <EditBrandModal
        brand={brand}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export function BrandsWithIntegrationsList({
  brands,
  integrations,
}: BrandsWithIntegrationsListProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
  const [refreshingIntegrations, setRefreshingIntegrations] = useState<
    Set<string>
  >(new Set());
  const router = useRouter();
  // Group integrations by brand
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
                isOpen={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
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

                    return (
                      <div
                        key={integration.id}
                        className="grid grid-cols-3 gap-2 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <platform.Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {platform.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <UserAvatar
                            src={integration.accountAvatarUrl || undefined}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {integration.accountName}
                            </span>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setRefreshingIntegrations(
                                (prev) => new Set([...prev, integration.id])
                              );
                              updateAccountInfo(integration.id)
                                .then(() => {
                                  toast.success("Account info updated");
                                  router.refresh();
                                })
                                .catch((error) => {
                                  console.error(error);
                                  toast.error("Failed to update account info");
                                })
                                .finally(() => {
                                  setRefreshingIntegrations((prev) => {
                                    const next = new Set(prev);
                                    next.delete(integration.id);
                                    return next;
                                  });
                                });
                            }}
                            disabled={refreshingIntegrations.has(
                              integration.id
                            )}
                          >
                            <RefreshCw
                              className={`h-4 w-4 ${
                                refreshingIntegrations.has(integration.id)
                                  ? "animate-spin"
                                  : ""
                              }`}
                            />
                          </Button>
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
