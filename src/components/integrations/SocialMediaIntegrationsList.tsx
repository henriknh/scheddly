"use client";

import { Brand, SocialMediaIntegration } from "@/generated/prisma";
import Image from "next/image";
import { useState } from "react";
import { Header } from "../common/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { platforms } from "./SocialMediaIntegrations";
import { AddIntegrationModal } from "./AddIntegrationModal";
import { DeleteIntegrationDialog } from "./DeleteIntegrationDialog";

interface SocialMediaIntegrationsListProps {
  integrations: (SocialMediaIntegration & {
    brand?: Brand | null;
  })[];
}

export function SocialMediaIntegrationsList({
  integrations,
}: SocialMediaIntegrationsListProps) {
  const [isOpen, setIsOpen] = useState(false);

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
            <TableHead>Brand</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[40px] text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {integrations.length > 0 ? (
            integrations.map((integration) => {
              const platform = platforms.find(
                (p) => p.id === integration.socialMedia
              );

              if (!platform) return null;

              return (
                <TableRow key={integration.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Image
                        src={platform.icon}
                        alt={platform.name}
                        width={16}
                        height={16}
                        className="h-4 w-4"
                      />
                      {platform.name}
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
