"use client";

import { addXCommunity } from "@/app/api/social-media-integration/add-x-community";
import { SocialMediaIntegrationWithRelations } from "@/app/api/social-media-integration/types";
import { Caption } from "@/components/common/Caption";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AlertCircleIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface AddXCommunityModalProps {
  integration: SocialMediaIntegrationWithRelations;
}

export function AddXCommunityModal({ integration }: AddXCommunityModalProps) {
  const [open, setOpen] = useState(false);
  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputIdRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleAddCommunity = async () => {
    const communityId = inputIdRef.current?.value;
    const communityName = inputNameRef.current?.value;

    if (!communityId || !communityName) {
      return;
    }

    try {
      const community = await addXCommunity(
        integration.id,
        communityName,
        communityId
      );
      setOpen(false);
      toast.success(`Community ${community.name} added`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add community");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon className="h-4 w-4" />
          Add community
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add X Community</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircleIcon className="!top-3.5" />
            <AlertTitle className="mb-0">
              Due to limited support for communities in the official X API you
              need to manually add your communities.
            </AlertTitle>
          </Alert>

          <Caption>
            Enter the name and ID of the X community you want to add. Your
            communities can be found{" "}
            <Link
              href="https://x.com/i/communities"
              target="_blank"
              className="underline"
            >
              here
            </Link>{" "}
            and the ID can be found in the URL after /i/communities/ after
            you&apos;ve clicked on the community.
          </Caption>

          <div className="space-y-2">
            <Input ref={inputNameRef} placeholder="Community name" />

            <Input
              ref={inputIdRef}
              placeholder="1234567890"
              prefix="https://x.com/i/communities/"
              prefixClassName="opacity-50"
              className="px-0"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddCommunity}>Add Community</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
