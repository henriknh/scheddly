"use client";

import { acceptInvitation } from "@/app/api/team/accept-invitation";
import { declineInvitation } from "@/app/api/team/decline-invitation";
import { InvitationWithRelations } from "@/app/api/team/types";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface TeamInvitationProps {
  pendingInvitation: InvitationWithRelations;
}

export function TeamInvitation({ pendingInvitation }: TeamInvitationProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onDeclineInvitation = async () => {
    try {
      await declineInvitation(pendingInvitation.id);
      toast.success("Invitation declined");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("DECLINE_INVITE_UI_ERROR", error);
      toast.error("Failed to decline");
    }
  };

  const onAcceptInvitation = async () => {
    try {
      await acceptInvitation(pendingInvitation.id);
      toast.success("Invitation accepted");
      router.refresh();
    } catch (error) {
      console.error("ACCEPT_INVITE_UI_ERROR", error);
      toast.error("Failed to accept");
    }
  };

  return (
    <Alert>
      <span className="flex items-center justify-center">
        <Mail className="h-4 w-4" />
      </span>

      <AlertDescription className="flex md:flex-row flex-col justify-between items-center w-full gap-2">
        <div>Invitation to join {pendingInvitation.team.name}</div>

        <div className="max-md:w-full flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(true)}
                className="max-md:flex-1"
              >
                Decline
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Decline Invitation</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Are you sure you want to decline this invitation?
              </DialogDescription>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDeclineInvitation()}
                >
                  Decline
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            size="sm"
            onClick={() => onAcceptInvitation()}
            className="max-md:flex-1"
          >
            Accept
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
