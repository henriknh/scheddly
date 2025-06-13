"use client";

import { logout } from "@/app/api/auth/logout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();

      router.push("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="destructive"
      className="w-full sm:w-auto"
    >
      Logout
    </Button>
  );
}
