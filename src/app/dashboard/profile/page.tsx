"use client";

import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { ProfileInfoForm } from "@/components/profile/ProfileInfoForm";
import { SocialMediaIntegrations } from "@/components/profile/SocialMediaIntegrations";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      router.push("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="profile-settings" className="space-y-2">
        <TabsList className="">
          <TabsTrigger value="profile-settings">Profile settings</TabsTrigger>
          <TabsTrigger value="social-media-integrations">
            Social media integrations
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile-settings" className="space-y-4">
          <ProfileInfoForm />
          <PasswordChangeForm />
          <div className="flex justify-end">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              Logout
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="social-media-integrations">
          <SocialMediaIntegrations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
