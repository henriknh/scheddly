"use client";

import { BrandWithRelations } from "@/app/api/brand/types";
import { disconnectIntegrationFromBrand } from "@/app/api/social-media-integration/disconnect-integration-from-brand";
import { SocialMediaIntegrationWithRelations } from "@/app/api/social-media-integration/types";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { Unlink } from "lucide-react";
import { useState } from "react";
import { ConnectToBrandModal } from "./ConnectToBrandModal";
import { DeleteIntegrationModal } from "./DeleteIntegrationModal";
import { IntegrationAccountButton } from "./IntegrationAccountButton";
import { RefreshIntegration } from "./RefreshIntegration";
import { EditIntegrationModal } from "./EditIntegrationModal";

interface GroupedIntegrationsListProps {
  integrations: SocialMediaIntegrationWithRelations[];
  brands: BrandWithRelations[];
}

export function GroupedIntegrationsList({
  integrations,
  brands,
}: GroupedIntegrationsListProps) {
  console.log("integrations", integrations);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const isMobile = useIsMobile();
  if (integrations.length === 0) return null;

  const onDisconnect = async (integrationId: string) => {
    try {
      setIsConnecting(integrationId);
      await disconnectIntegrationFromBrand(integrationId);
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Failed to disconnect integration from brand:", error);
    } finally {
      setIsConnecting(null);
    }
  };

  return (
    <div className="max-md:divide-y">
      {integrations.map((integration) => {
        const isConnected = integration.brand !== null;

        const platform = socialMediaPlatforms.find(
          (p) => p.id === integration.socialMedia
        );

        if (!platform) return null;

        return (
          <div key={integration.id} className="space-y-0.5 py-2">
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center gap-2">
                <platform.Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{platform.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <IntegrationAccountButton integration={integration} />

                {isMobile ? null : (
                  <>
                    <RefreshIntegration integrationId={integration.id} />

                    {isConnected ? (
                      <Button
                        variant={isMobile ? "ghost" : "outline"}
                        size={isMobile ? "icon" : "sm"}
                        onClick={() => onDisconnect(integration.id)}
                        disabled={isConnecting === integration.id}
                      >
                        <Unlink className="h-4 w-4" />
                        {isMobile ? null : "Disconnect from brand"}
                      </Button>
                    ) : (
                      <ConnectToBrandModal
                        integrationId={integration.id}
                        brands={brands}
                      />
                    )}

                    <EditIntegrationModal integration={integration} />

                    <DeleteIntegrationModal integrationId={integration.id} />
                  </>
                )}
              </div>
            </div>

            {isMobile ? (
              <div className="flex items-center gap-2 justify-end">
                <RefreshIntegration integrationId={integration.id} />

                {isConnected ? (
                  <Button
                    variant={isMobile ? "ghost" : "outline"}
                    size={isMobile ? "icon" : "sm"}
                    onClick={() => onDisconnect(integration.id)}
                    disabled={isConnecting === integration.id}
                  >
                    <Unlink className="h-4 w-4" />
                    {isMobile ? null : "Disconnect from brand"}
                  </Button>
                ) : (
                  <ConnectToBrandModal
                    integrationId={integration.id}
                    brands={brands}
                  />
                )}

                <EditIntegrationModal integration={integration} />

                <DeleteIntegrationModal integrationId={integration.id} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
