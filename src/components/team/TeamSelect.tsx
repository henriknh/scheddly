"use client";

import { selectTeam } from "@/app/api/team/select-team";
import { CleanedUser } from "@/app/api/user/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface TeamSelectProps {
  user: CleanedUser;
}

export function TeamSelect({ user }: TeamSelectProps) {
  const router = useRouter();

  const onChange = async (value: string) => {
    try {
      await selectTeam(value);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to select team");
    }
  };

  if (!user?.teams?.length) return null;

  return (
    <Select onValueChange={onChange} value={user.team?.id}>
      <SelectTrigger>
        <SelectValue placeholder="Select team" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {user.teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
