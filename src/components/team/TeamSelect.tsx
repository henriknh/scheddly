import { useAuth } from "@/lib/auth-context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { selectTeam } from "@/app/api/team/select-team";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function TeamSelect() {
  const { user } = useAuth();
  const router = useRouter();

  const onChange = async (value: string) => {
    try {
      await selectTeam(value);
      toast.success("Team selected");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to select team");
    }
  };

  if (!user?.teams?.length) return null;

  return (
    <Select onValueChange={onChange} defaultValue={user.team?.id}>
      <SelectTrigger>
        <SelectValue placeholder="Select team" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Teams</SelectLabel>
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
