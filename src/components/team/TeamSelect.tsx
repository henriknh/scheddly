"use client";

import { selectTeam } from "@/app/api/team/select-team";
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
import { TeamWithRelations } from "@/app/api/team/types";
import { useAuth } from "@/lib/auth-context";

interface TeamSelectProps {
  teams: TeamWithRelations[];
}

export function TeamSelect({ teams }: TeamSelectProps) {
  const router = useRouter();
  const { user } = useAuth();

  const onChange = async (value: string) => {
    try {
      await selectTeam(value);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to select team");
    }
  };

  if (!teams?.length) return null;

  return (
    <Select onValueChange={onChange} value={user?.teamId ?? undefined}>
      <SelectTrigger>
        <SelectValue placeholder="Select team" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
