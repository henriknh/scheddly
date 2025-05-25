"use client";

import { User } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const [loading, setLoading] = useState(!initialUser);
  const router = useRouter();

  useEffect(() => {
    reloadUser();
  }, []);

  async function reloadUser() {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        console.log("User data:", data.user);
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const data = await response.json();
      setUser(data.user);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error);
        throw new Error(error.message);
      }
      console.error("Unknown login error:", error);
      throw new Error("An error occurred during login");
    }
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  async function register(email: string, name: string, password: string) {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      // After successful registration, automatically log in
      await login(email, password);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Registration error:", error);
        throw new Error(error.message);
      }
      console.error("Unknown registration error:", error);
      throw new Error("An error occurred during registration");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        reloadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
