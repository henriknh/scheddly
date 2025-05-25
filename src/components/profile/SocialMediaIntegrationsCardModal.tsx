"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Platform } from "./SocialMediaIntegrations";
import Link from "next/link";
import { ExternalLink, Link2 } from "lucide-react";

interface FormData {
  clientId?: string | null;
  clientSecret?: string | null;
  accessToken?: string | null;
}

type SocialMediaIntegrationsCardModalProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
  platform: Platform;
};

export function SocialMediaIntegrationsCardModal({
  isDialogOpen,
  setIsDialogOpen,
  platform,
}: SocialMediaIntegrationsCardModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    clientId: platform.clientIdAndSecretConfig?.clientId,
    clientSecret: platform.clientIdAndSecretConfig?.clientSecret,
    accessToken: platform.accessTokenConfig?.accessToken,
  });

  const handleSave = async () => {
    if (!platform) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/social-media/${platform.id}/setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok)
        throw new Error(`Failed to save ${platform.name} configuration`);

      toast.success(`${platform.name} configuration saved successfully`);
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error(`Failed to save ${platform.name} config:`, error);
      toast.error(`Failed to save ${platform.name} configuration`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!platform) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/social-media/${platform.id}/setup`, {
        method: "DELETE",
      });

      if (!response.ok)
        throw new Error(`Failed to delete ${platform.name} configuration`);

      toast.success(`${platform.name} configuration removed successfully`);
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error(`Failed to delete ${platform.name} config:`, error);
      toast.error(`Failed to delete ${platform.name} configuration`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {platform && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {platform.isConfigured ? "Update" : "Setup"} {platform.name}{" "}
              integration
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {platform.clientIdAndSecretConfig && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="clientId">
                    {platform.clientIdAndSecretConfig.clientIdLabel}
                  </Label>
                  <Input
                    id="clientId"
                    type="text"
                    value={formData.clientId || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        clientId: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientSecret">
                    {platform.clientIdAndSecretConfig.clientSecretLabel}
                  </Label>
                  <Input
                    id="clientSecret"
                    type="text"
                    value={formData.clientSecret || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        clientSecret: e.target.value,
                      }))
                    }
                  />
                </div>
              </>
            )}

            {platform.accessTokenConfig && (
              <div className="space-y-2">
                <Label htmlFor="accessToken">
                  {platform.accessTokenConfig.accessTokenLabel}
                </Label>
                <Input
                  id="accessToken"
                  type="text"
                  value={formData.accessToken || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      accessToken: e.target.value,
                    }))
                  }
                />
              </div>
            )}

            <div className="flex flex-col">
              <div>How to setup integration:</div>
              <Link
                href={platform.configurationGuideUrl}
                target="_blank"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                {platform.configurationGuideUrl}
              </Link>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            {platform.isConfigured && (
              <Button
                variant="ghost"
                onClick={handleDelete}
                disabled={isLoading}
              >
                Remove Connection
              </Button>
            )}
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
