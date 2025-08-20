import { InvitationWithRelations } from "@/app/api/team/types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { cancelInvitation } from "@/app/api/team/cancel-invitation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserX } from "lucide-react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface CancelInviteDialogProps {
  invitation: InvitationWithRelations;
}

export function CancelInviteDialog({ invitation }: CancelInviteDialogProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const onCancelInvitation = async () => {
    try {
      await cancelInvitation(invitation.id);
      toast.success("Invitation cancelled");
      router.refresh();
    } catch (error) {
      console.error("CANCEL_INVITATION_ERROR", error);
      toast.error("Failed to cancel invitation");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isMobile ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
                <UserX className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Cancel invitation</TooltipContent>
          </Tooltip>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
            <UserX className="h-4 w-4" />
            Cancel invitation
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel invitation</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Are you sure you want to cancel the invitation to{" "}
          {invitation.invitedUser?.name ?? invitation.email}?
        </DialogDescription>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onCancelInvitation}>Cancel invitation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
