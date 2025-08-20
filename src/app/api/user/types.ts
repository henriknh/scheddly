import { File, Team, User, Subscription } from "@/generated/prisma";

export interface UserWithRelations extends User {
  avatar?: File | null;
  team?: Team | null;
  teams?: Team[] | null;
  subscription: Subscription | null;
}

export type CleanedUser = Omit<UserWithRelations, "password"> & {
  password?: undefined;
};
