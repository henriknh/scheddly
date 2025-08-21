import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { useState } from "react";
import { leaveTeam } from "@/app/api/team/leave-team";
import { useRouter } from "next/navigation";
import { TeamWithRelations } from "@/app/api/team/types";

interface LeaveTeamDialogProps {
  team: TeamWithRelations;
}

export function LeaveTeamDialog({ team }: LeaveTeamDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onLeaveTeam = async () => {
    try {
      await leaveTeam(team.id);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("LEAVE_TEAM_UI_ERROR", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <LogOut />
          Leave Team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave Team</DialogTitle>
        </DialogHeader>
        <div>
          <p>Are you sure you want to leave the team {team.name}?</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onLeaveTeam}>
            Leave Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
