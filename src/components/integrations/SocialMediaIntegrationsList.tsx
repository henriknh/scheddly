"use client";

import {
  updateAccountInfo,
  updateIntegrationBrand,
} from "@/app/actions/social-media-integrations";
import {
  Brand,
  SocialMediaIntegration,
  SocialMediaIntegrationAccountInfo,
} from "@/generated/prisma";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { RefreshCcwIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Header } from "../common/Header";
import { UserAvatar } from "../common/UserAvatar";
import { Button } from "../ui/button";
import { DataTable, DataTableColumnDef } from "../ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AddIntegrationModal } from "./AddIntegrationModal";
import { DeleteIntegrationDialog } from "./DeleteIntegrationDialog";

interface SocialMediaIntegrationsListProps {
  integrations: (SocialMediaIntegration & {
    brand?: Brand | null;
    socialMediaIntegrationAccountInfo?: SocialMediaIntegrationAccountInfo | null;
  })[];
  brands: Brand[];
}

export function SocialMediaIntegrationsList({
  integrations,
  brands,
}: SocialMediaIntegrationsListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleBrandChange = async (
    integrationId: string,
    brandId: string | null
  ) => {
    try {
      await updateIntegrationBrand(integrationId, brandId);
      toast.success("Brand updated successfully");
      router.refresh();
    } catch (error) {
      console.error("Error updating brand:", error);
      toast.error("Failed to update brand");
    }
  };

  const columns: DataTableColumnDef<
    SocialMediaIntegration & {
      brand?: Brand | null;
      socialMediaIntegrationAccountInfo?: SocialMediaIntegrationAccountInfo | null;
    },
    unknown
  >[] = [
    {
      accessorKey: "socialMedia",
      header: "Platform",
      cell: ({ row }) => {
        const socialMediaPlatform = socialMediaPlatforms.find(
          (p) => p.id === row.original.socialMedia
        );

        if (!socialMediaPlatform) return null;

        return (
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
        );
      },
    },
    {
      accessorKey: "socialMediaIntegrationAccountInfo",
      header: "Account",
      cell: ({ row }) => {
        const accountInfo = row.original.socialMediaIntegrationAccountInfo;
        return (
          <div className="flex items-center gap-2">
            <UserAvatar
              src={accountInfo?.avatarUrl}
              fallback={accountInfo?.name}
            />
            {accountInfo?.name ?? <span>&mdash;</span>}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                updateAccountInfo(row.original.id)
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
        );
      },
    },
    {
      accessorKey: "brand",
      header: "Brand",
      cell: ({ row }) => {
        return (
          <Select
            value={row.original.brand?.id ?? "none"}
            onValueChange={(value) =>
              handleBrandChange(
                row.original.id,
                value === "none" ? null : value
              )
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No brand</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return <DeleteIntegrationDialog integrationId={row.original.id} />;
      },
      size: 36,
      align: "end",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Header>Social media integrations</Header>
        <AddIntegrationModal isOpen={isOpen} onOpenChange={setIsOpen} />
      </div>
      <DataTable columns={columns} data={integrations} />
    </div>
  );
}
