"use client";

import { Brand, SocialMediaIntegration } from "@/generated/prisma";
import { PlusIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { platforms } from "./SocialMediaIntegrations";

interface SocialMediaIntegrationsListProps {
  integrations: (SocialMediaIntegration & {
    brand: Brand;
  })[];
}

export function SocialMediaIntegrationsList({
  integrations,
}: SocialMediaIntegrationsListProps) {
  const router = useRouter();

  const deleteIntegration = async (id: string) => {
    try {
      const response = await fetch(
        `/api/user/social-media-integrations?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete integration");
      }

      toast.success("Integration removed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove integration");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-lg font-medium">Social media integrations</h2>

        <Button>
          <PlusIcon className="w-4 h-4" />
          Add integration
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Platform</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {integrations.map((integration) => {
            const platform = platforms.find(
              (p) => p.id === integration.socialMedia
            );
            if (!platform) return null;

            return (
              <TableRow key={integration.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      src={platform.icon}
                      alt={platform.name}
                      width={24}
                      height={24}
                      className="rounded-sm"
                    />
                    <span>{platform.name}</span>
                  </div>
                </TableCell>
                <TableCell>{integration.brand.name}</TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove integration</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this integration? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            deleteIntegration(integration.id).then(() => {
                              router.refresh();
                            })
                          }
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
