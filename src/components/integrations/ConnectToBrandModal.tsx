"use client";

import { BrandWithRelations } from "@/app/api/brand/types";
import { connectIntegrationToBrand } from "@/app/api/social-media-integration/connect-integration-to-brand";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ConnectToBrandModalProps {
  integrationId: string;
  brands: BrandWithRelations[];
}

export function ConnectToBrandModal({
  integrationId,
  brands,
}: ConnectToBrandModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();

  const onConnect = async (brandId: string) => {
    try {
      setIsConnecting(true);
      await connectIntegrationToBrand(integrationId, brandId);
      router.refresh();
    } catch (error) {
      console.error("Failed to connect integration to brand:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={brands.length === 0}>
          <Link className="h-4 w-4" />
          Connect to Brand
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to Brand</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {brands.length === 0 ? (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                You don&apos;t have any brands yet.
              </p>
              <p className="text-xs text-muted-foreground">
                Create a brand first to connect this integration.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Select a brand to connect this integration to:
              </p>
              <div className="grid gap-2">
                {brands.map((brand) => (
                  <Button
                    key={brand.id}
                    variant="outline"
                    className="justify-start"
                    onClick={() => onConnect(brand.id)}
                    disabled={isConnecting}
                  >
                    {brand.name}
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
