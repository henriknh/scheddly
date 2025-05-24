import { cookies } from "next/headers";
import { AuthProvider } from "@/lib/auth-context";
import { jwtDecode } from "jwt-decode";
import { User } from "@/generated/prisma";

async function getInitialUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwtDecode(token) as User;
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
