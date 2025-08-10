"use client";

import { SocialMediaIntegrationWithRelations } from "@/app/api/social-media-integration/types";
import { SocialMedia } from "@/generated/prisma";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ManageXCommunities } from "./edit-integration-modal/ManageXCommunities";

interface EditIntegrationModalProps {
  integration: SocialMediaIntegrationWithRelations;
}

export function EditIntegrationModal({
  integration,
}: EditIntegrationModalProps) {
  const [open, setOpen] = useState(false);

  const canEdit = integration.socialMedia === SocialMedia.X;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={!canEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit integration</DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          {integration.socialMedia === SocialMedia.X && (
            <>
              <ManageXCommunities integration={integration} />
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button disabled>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
