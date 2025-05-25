"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialMedia } from "@/generated/prisma";
import { useAuth } from "@/lib/auth-context";
import { ExternalLink, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Platform } from "./SocialMediaIntegrations";
import { DialogDescription } from "@radix-ui/react-dialog";
import { USER_SECRET_REPLACEMENT } from "@/lib/user-secret-replacement";

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

export function SocialMediaIntegrationsEditModal({
  isDialogOpen,
  setIsDialogOpen,
  platform,
}: SocialMediaIntegrationsCardModalProps) {
  const { user, reloadUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [showSecret, setShowSecret] = useState(false);

  const clientId = useMemo(() => {
    switch (platform.id) {
      case SocialMedia.TUMBLR:
        return user?.tumblrClientId;
      case SocialMedia.PINTEREST:
        return user?.pinterestClientId;
      default:
        return null;
    }
  }, [platform.id, user?.tumblrClientId, user?.pinterestClientId]);

  const clientSecret = useMemo(() => {
    switch (platform.id) {
      case SocialMedia.TUMBLR:
        return user?.tumblrClientSecret;
      case SocialMedia.PINTEREST:
        return user?.pinterestClientSecret;
      default:
        return null;
    }
  }, [platform.id, user?.tumblrClientSecret, user?.pinterestClientSecret]);

  const accessToken = useMemo(() => {
    switch (platform.id) {
      default:
        return null;
    }
  }, [platform.id]);

  const isConfigured: boolean = !!(clientId && clientSecret);

  const [formData, setFormData] = useState<FormData>({
    clientId,
    clientSecret,
    accessToken,
  });

  useEffect(() => {
    setFormData({
      clientId,
      clientSecret,
      accessToken,
    });
    setShowSecret(false);
  }, [clientId, clientSecret, accessToken]);

  const handleSave = async () => {
    if (!platform) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/user/integation`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: platform.id,
          clientId: formData.clientId,
          clientSecret:
            formData.clientSecret !== USER_SECRET_REPLACEMENT
              ? formData.clientSecret
              : undefined,
          accessToken: formData.accessToken,
        }),
      });

      if (!response.ok)
        throw new Error(`Failed to save ${platform.name} configuration`);

      toast.success(`${platform.name} configuration saved successfully`);
      setIsDialogOpen(false);
      reloadUser();
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
      const response = await fetch(
        `/api/user/integation?platform=${platform.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok)
        throw new Error(`Failed to delete ${platform.name} configuration`);

      toast.success(`${platform.name} configuration removed successfully`);
      setIsDialogOpen(false);
      reloadUser();
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
              {isConfigured ? "Update" : "Setup"} {platform.name} integration
            </DialogTitle>
            <DialogDescription>{platform.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {platform.clientIdLabel && platform.clientSecretLabel && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="clientId">{platform.clientIdLabel}</Label>
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
                    {platform.clientSecretLabel}
                  </Label>

                  <div className="flex items-center gap-2">
                    <Input
                      id="clientSecret"
                      type={showSecret ? "text" : "password"}
                      value={formData.clientSecret || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          clientSecret: e.target.value,
                        }))
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      {showSecret ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {platform.accessTokenLabel && (
              <div className="space-y-2">
                <Label htmlFor="accessToken">{platform.accessTokenLabel}</Label>
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
            {isConfigured && (
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
