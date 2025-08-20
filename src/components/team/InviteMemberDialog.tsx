"use client";

import { inviteUserByEmail } from "@/app/api/team/invite-user-by-email";
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
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface InviteMemberDialogProps {
  teamId: string;
}

export function InviteMemberDialog({ teamId }: InviteMemberDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onInvite = async () => {
    try {
      setLoading(true);
      await inviteUserByEmail(email, teamId);
      toast.success("Invitation sent");
      setOpen(false);
      setEmail("");
      router.refresh();
    } catch (error) {
      console.error("INVITE_SUBMIT_ERROR", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send invitation"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus />
          Invite member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a team member</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <label className="text-sm">Email</label>
          <Input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={onInvite} disabled={!email || loading}>
            Send invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
