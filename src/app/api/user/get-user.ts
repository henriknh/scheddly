import { getUser } from "@/lib/user";

export async function getUserFromToken() {
  const user = await getUser();
  return user;
}
