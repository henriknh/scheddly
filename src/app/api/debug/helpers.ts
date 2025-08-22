import { getUserFromToken } from "../user/get-user-from-token";

export const allowedEmails = ["hello@henriknh.com"];

export async function isDebugUser(): Promise<boolean> {
  const currentUser = await getUserFromToken();

  if (!currentUser || !allowedEmails.includes(currentUser.email || "")) {
    return false;
  }

  return true;
}

export async function assertDebugUser(): Promise<boolean | never> {
  const isDebug = await isDebugUser();
  if (!isDebug) {
    throw new Error("Forbidden");
  }
  return isDebug;
}
