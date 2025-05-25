"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Platform } from "./SocialMediaIntegrations";
import { SocialMediaIntegrationsEditModal } from "./SocialMediaIntegrationsEditModal";
import { SocialMedia } from "@/generated/prisma";
import { useAuth } from "@/lib/auth-context";
import { TableCell } from "../ui/table";
import { TableRow } from "../ui/table";

type SocialMediaIntegrationsCardProps = {
  platform: Platform;
};

export function SocialMediaIntegrationsRow({
  platform,
}: SocialMediaIntegrationsCardProps) {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isConfigured = useMemo(() => {
    switch (platform.id) {
      case SocialMedia.TUMBLR:
        return !!(user?.tumblrClientId && user?.tumblrClientSecret);
      case SocialMedia.PINTEREST:
        return !!(user?.pinterestClientId && user?.pinterestClientSecret);
      default:
        return false;
    }
  }, [
    platform.id,
    user?.tumblrClientId,
    user?.tumblrClientSecret,
    user?.pinterestClientId,
    user?.pinterestClientSecret,
  ]);

  return (
    <TableRow key={platform.id}>
      <TableCell>
        <div className="flex items-center gap-2">
          <Image
            src={platform.icon}
            alt={platform.name}
            width={16}
            height={16}
            className="h-4 w-4"
          />
          <span>{platform.name}</span>
        </div>
      </TableCell>
      <TableCell className="flex justify-end items-center gap-2">
        <Badge variant={isConfigured ? "success" : "secondary"}>
          {isConfigured ? "Configured" : "Not Configured"}
        </Badge>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDialogOpen(true)}
          className="min-h-9 !w-9"
        >
          <Settings2 className="h-4 w-4" />
        </Button>

        <SocialMediaIntegrationsEditModal
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          platform={platform}
        />
      </TableCell>
    </TableRow>
  );
}
