import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { AddIntegrationModalButton } from "./AddIntegrationModalButton";

interface AddIntegrationModalProps {
  brandId?: string | null;
}

export function AddIntegrationModal({ brandId }: AddIntegrationModalProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="max-md:flex-1">
          <PlusIcon className="w-4 h-4" />
          Add integration
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose platform</DialogTitle>
          <DialogDescription>
            Select a social media platform to integrate with
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {socialMediaPlatforms.map((socialMediaPlatform) => (
            <AddIntegrationModalButton
              key={socialMediaPlatform.id}
              socialMediaPlatform={socialMediaPlatform}
              brandId={brandId}
              setIsAddModalOpen={setIsAddModalOpen}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
