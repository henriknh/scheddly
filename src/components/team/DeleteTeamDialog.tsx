import { deleteTeam } from "@/app/api/team/delete-team";
import { useIsMedium } from "@/hooks/use-is-medium";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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

interface DeleteTeamDialogProps {
  teamId: string;
}

export function DeleteTeamDialog({ teamId }: DeleteTeamDialogProps) {
  const router = useRouter();
  const isMedium = useIsMedium();
  const [isOpen, setIsOpen] = useState(false);

  const onDelete = async () => {
    try {
      await deleteTeam(teamId);
      toast.success("Team deleted successfully");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete team");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isMedium ? (
          <Button variant="outline" size="icon">
            <Trash className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <Trash className="h-4 w-4" />
            Delete Team
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Team</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this team?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
