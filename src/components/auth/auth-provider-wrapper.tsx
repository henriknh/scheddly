import { AuthProvider } from "@/lib/auth-context";
import { CleanedUser } from "@/app/api/user/types";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

async function getInitialUser(): Promise<CleanedUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwtDecode(token) as CleanedUser;
    return decoded;
  } catch (error) {
    console.error("Error getting initial user:", error);
    return null;
  }
}

export async function AuthProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUser = await getInitialUser();

  return <AuthProvider initialUser={initialUser}>{children}</AuthProvider>;
}
