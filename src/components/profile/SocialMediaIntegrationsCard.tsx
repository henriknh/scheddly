"use client";

import { Button } from "@/components/ui/button";
import { SocialMedia } from "@/generated/prisma";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import { useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Platform } from "./SocialMediaIntegrations";

type SocialMediaIntegrationsCardProps = {
  platform: Platform;
};

export function SocialMediaIntegrationsCard({
  platform,
}: SocialMediaIntegrationsCardProps) {
  const { user, reloadUser } = useAuth();

  const isOauth2Connected = useMemo(() => {
    switch (platform.id) {
      case SocialMedia.PINTEREST:
        return user?.oauth2PinterestCode;
      default:
        return false;
    }
  }, [platform.id, user?.oauth2PinterestCode]);

  const openOauth2Window = () => {
    if (!oauth2Url) {
      return;
    }

    const channel = new BroadcastChannel("oauth2_integration_complete");
    window.open(oauth2Url, "_blank");

    channel.onmessage = (event) => {
      const oauth2Success = event?.data === "oauth2-success";

      if (oauth2Success) {
        toast.success("Oauth2 code saved");
        reloadUser();
      } else {
        toast.error("Oauth2 code not saved");
      }

      channel.close();
    };
  };

  const removeOauth2Code = () => {
    fetch(`/api/user/oauth2-code?platform=${platform.id}`, {
      method: "DELETE",
    }).then(() => {
      toast.success("Oauth2 code removed");
      reloadUser();
    });
  };

  const oauth2Url = useMemo(() => {
    switch (platform.id) {
      case SocialMedia.PINTEREST:
        return process.env
          .NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_PINTEREST_CLIENT_ID &&
          process.env
            .NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_PINTEREST_REDIRECT_URI
          ? `https://www.pinterest.com/oauth/?client_id=${process.env.NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_PINTEREST_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_PINTEREST_REDIRECT_URI}&response_type=code&scope=boards:read,pins:read`
          : null;
    }
  }, [platform.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={platform.icon}
                alt={platform.name}
                width={16}
                height={16}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium">{platform.name}</span>
            </div>

            <Badge variant={isOauth2Connected ? "success" : "secondary"}>
              {isOauth2Connected ? "Connected" : "Not Connected"}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p>{platform.description}</p>
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        {isOauth2Connected ? (
          <Button size="sm" onClick={removeOauth2Code} variant={"ghost"}>
            Disconnect
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={openOauth2Window}
            disabled={!oauth2Url}
            variant={"ghost"}
          >
            Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
