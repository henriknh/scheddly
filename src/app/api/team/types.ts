import { Invitation, Subscription, Team } from "@/generated/prisma";
import { UserWithRelations } from "@/app/api/user/types";

export interface InvitationWithRelations extends Invitation {
  team: Team;
  invitedUser?: UserWithRelations | null;
}

export interface TeamWithRelations extends Team {
  owner: UserWithRelations;
  members: UserWithRelations[];
  invitations: InvitationWithRelations[];
  subscription?: Subscription | null;
}
