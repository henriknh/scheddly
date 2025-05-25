"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Platform } from "./SocialMediaIntegrations";
import { SocialMediaIntegrationsCardModal } from "./SocialMediaIntegrationsCardModal";

type SocialMediaIntegrationsCardProps = {
  platform: Platform;
};

export function SocialMediaIntegrationsCard({
  platform,
}: SocialMediaIntegrationsCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card key={platform.id}>
      <CardContent className="w-full flex items-center justify-between p-6">
        <div className="flex-1 flex items-center gap-4">
          <Image
            src={platform.icon}
            alt={platform.name}
            width={40}
            height={40}
            className="h-10 w-10"
          />

          <div className="flex-1 flex flex-col lg:flex-row lg:justify-between gap-2">
            <div>
              <h3 className="font-semibold">{platform.name}</h3>
              <p className="text-sm text-muted-foreground">
                {platform.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={platform.isConfigured ? "success" : "secondary"}>
                {platform.isConfigured ? "Configured" : "Not Configured"}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDialogOpen(true)}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <SocialMediaIntegrationsCardModal
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        platform={platform}
      />
    </Card>
  );
}
