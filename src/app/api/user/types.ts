import { File, Team, User } from "@/generated/prisma";

export interface UserWithRelations extends User {
  avatar?: File | null;
  team?: Team | null;
  teams?: Team[] | null;
}

export type CleanedUser = Omit<UserWithRelations, "password"> & {
  password?: undefined;
};
