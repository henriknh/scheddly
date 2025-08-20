"use client";

import { createTeam } from "@/app/api/team/create-team";
import { UserPlus } from "lucide-react";
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
import { Input } from "../ui/input";

export function CreateTeamDialog() {
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const router = useRouter();

  const onSubmit = async () => {
    try {
      await createTeam(teamName);
      setOpen(false);
      setTeamName("");
      toast.success("Team created");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create team");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="h-4 w-4" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Create a new team to manage your social media content.
          </DialogDescription>
        </DialogHeader>

        <Input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={onSubmit}>
            Create Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
