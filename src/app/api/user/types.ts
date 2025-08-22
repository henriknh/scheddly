import { File, Subscription, User } from "@/generated/prisma";

export interface UserWithLightRelations extends User {
  avatar?: File | null;
}

export interface UserWithFullRelations extends User {
  avatar?: File | null;
  subscription: Subscription | null;
}

export type CleanedUser = Omit<UserWithFullRelations, "password"> & {
  password?: undefined;
};
