import { UserWithLightRelations } from "@/app/api/user/types";
import { Invitation, Team } from "@/generated/prisma";

export interface InvitationWithRelations extends Invitation {
  team: Team;
  invitedUser?: UserWithLightRelations | null;
}

export interface TeamWithRelations extends Team {
  owner: UserWithLightRelations;
  members: UserWithLightRelations[];
  invitations: InvitationWithRelations[];
}
