import { kickMember } from "@/app/api/team/kick-member";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserMinus } from "lucide-react";
import { TeamWithRelations } from "@/app/api/team/types";
import { UserWithRelations } from "@/app/api/user/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useAuth } from "@/lib/auth-context";

interface KickTeamMemberDialogProps {
  team: TeamWithRelations;
  member: UserWithRelations;
}

export function KickTeamMemberDialog({
  team,
  member,
}: KickTeamMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const onKickMember = async () => {
    try {
      await kickMember(team.id, member.id);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("KICK_TEAM_MEMBER_ERROR", error);
    }
  };

  if (member.id === team.ownerId) {
    return null;
  }

  if (user?.id !== team.ownerId) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isMobile ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(true)}
                disabled={member.id === team.ownerId}
              >
                <UserMinus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Uninvite user</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(true)}
            disabled={member.id === team.ownerId}
          >
            <UserMinus />
            Uninvite user
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kick Team Member</DialogTitle>
        </DialogHeader>
        <div>
          <p>
            Are you sure you want to kick {member.name} from the team{" "}
            {team.name}?
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onKickMember}>
            Kick
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
