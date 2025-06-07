"use client";

import { Brand, SocialMediaIntegration } from "@/generated/prisma";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { Plus, RefreshCw, Pencil } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddIntegrationModal } from "@/components/integrations/AddIntegrationModal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeleteIntegrationDialog } from "@/components/integrations/DeleteIntegrationDialog";
import { AddBrandModal } from "@/components/brands/AddBrandModal";
import { EditBrandModal } from "@/components/brands/EditBrandModal";
import { DeleteBrandDialog } from "@/components/brands/DeleteBrandDialog";
import { Header } from "@/components/common/Header";

import { updateAccountInfo } from "@/app/actions/social-media-integrations";

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
    <div className="space-y-4">
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
              <div className="space-y-2">
                {brandIntegrations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
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
                        className="grid grid-cols-[1fr_2fr_auto] items-center gap-4 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Image
                            src={platform.icon}
                            alt={platform.name}
                            width={16}
                            height={16}
                            className="h-4 w-4"
                          />
                          <span className="text-sm font-medium">
                            {platform.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Avatar className="h-4 w-4">
                            <AvatarImage
                              src={integration.avatarUrl || undefined}
                              alt={integration.name}
                            />
                            <AvatarFallback>
                              {integration.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {integration.name}
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
