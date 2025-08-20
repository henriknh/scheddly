import { File, Team, User, Subscription } from "@/generated/prisma";

export interface UserWithLightRelations extends User {
  avatar?: File | null;
}

export interface UserWithFullRelations extends User {
  avatar?: File | null;
  team?: Team | null;
  teams?: Team[] | null;
  subscription: Subscription | null;
}

export type CleanedUser = Omit<UserWithFullRelations, "password"> & {
  password?: undefined;
};
