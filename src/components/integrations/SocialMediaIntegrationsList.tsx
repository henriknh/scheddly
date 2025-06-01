"use client";

import {
  Brand,
  SocialMediaIntegration,
  SocialMediaIntegrationAccountInfo,
} from "@/generated/prisma";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { updateAccountInfo } from "@/app/actions/social-media-integrations";
import { RefreshCcwIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Header } from "../common/Header";
import { UserAvatar } from "../common/UserAvatar";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { AddIntegrationModal } from "./AddIntegrationModal";
import { DeleteIntegrationDialog } from "./DeleteIntegrationDialog";

interface SocialMediaIntegrationsListProps {
  integrations: (SocialMediaIntegration & {
    brand?: Brand | null;
    socialMediaIntegrationAccountInfo?: SocialMediaIntegrationAccountInfo | null;
  })[];
}

export function SocialMediaIntegrationsList({
  integrations,
}: SocialMediaIntegrationsListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Header>Social media integrations</Header>
        <AddIntegrationModal isOpen={isOpen} onOpenChange={setIsOpen} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Platform</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[40px] text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {integrations.length > 0 ? (
            integrations.map((integration) => {
              const socialMediaPlatform = socialMediaPlatforms.find(
                (p) => p.id === integration.socialMedia
              );

              if (!socialMediaPlatform) return null;

              return (
                <TableRow key={integration.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Image
                        src={socialMediaPlatform.icon}
                        alt={socialMediaPlatform.name}
                        width={16}
                        height={16}
                        className="h-4 w-4"
                      />
                      {socialMediaPlatform.name}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        src={
                          integration.socialMediaIntegrationAccountInfo
                            ?.avatarUrl
                        }
                        fallback={
                          integration.socialMediaIntegrationAccountInfo?.name
                        }
                      />

                      {integration.socialMediaIntegrationAccountInfo?.name ?? (
                        <span>&mdash;</span>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          updateAccountInfo(integration.id)
                            .then(() => {
                              toast.success("Account info updated");
                              router.refresh();
                            })
                            .catch((error) => {
                              toast.error("Failed to update account info");
                              console.error(error);
                            });
                        }}
                      >
                        <RefreshCcwIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {integration.brand?.name ?? <span>&mdash;</span>}
                  </TableCell>
                  <TableCell>
                    {new Date(integration.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="w-[40px] text-right">
                    <DeleteIntegrationDialog integrationId={integration.id} />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No integrations found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
