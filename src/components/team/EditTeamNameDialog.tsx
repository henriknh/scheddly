"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { updateTeamName } from "@/app/api/team/update-team-name";

interface EditTeamNameDialogProps {
  teamId: string;
  currentName: string;
}

export function EditTeamNameDialog({
  teamId,
  currentName,
}: EditTeamNameDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    try {
      setLoading(true);
      await updateTeamName(teamId, name);
      toast.success("Team name updated");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("EDIT_TEAM_NAME_SUBMIT_ERROR", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update team name"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setName(currentName);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil />
          Edit team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit team</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <label className="text-sm">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Team name"
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
          <Button
            onClick={onSave}
            disabled={loading || name.trim().length === 0}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
