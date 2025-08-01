"use client";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/common/UserAvatar";
import { SocialMediaIntegration } from "@/generated/prisma";
import { getSocialMediaApiFunctions } from "@/lib/social-media-api-functions/social-media-api-functions";
import Link from "next/link";

interface IntegrationAccountButtonProps {
  integration: SocialMediaIntegration;
}

export function IntegrationAccountButton({
  integration,
}: IntegrationAccountButtonProps) {
  const socialMediaApiFunctions = getSocialMediaApiFunctions(
    integration.socialMedia
  );

  return (
    <Button variant="ghost" asChild>
      <Link
        href={socialMediaApiFunctions.externalAccountUrl(integration)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <UserAvatar src={integration.accountAvatarUrl || undefined} />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{integration.accountName}</span>
        </div>
      </Link>
    </Button>
  );
}
