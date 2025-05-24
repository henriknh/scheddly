"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { UserProfileForm } from "@/components/UserProfileForm";
import Image from "next/image";

interface ExtendedUser {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  tumblrOAuthConsumerKey?: string | null;
  tumblrOAuthConsumerSecret?: string | null;
}

export default function ProfilePage() {
  const { user } = useAuth() as { user: ExtendedUser | null };
  const router = useRouter();
  const [tumblrConfig, setTumblrConfig] = useState({
    consumerKey: user?.tumblrOAuthConsumerKey || "",
    consumerSecret: user?.tumblrOAuthConsumerSecret || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveTumblrConfig = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/social-media/tumblr/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consumerKey: tumblrConfig.consumerKey,
          consumerSecret: tumblrConfig.consumerSecret,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save Tumblr configuration");
      }

      toast.success("Tumblr configuration saved successfully");
      router.refresh();
    } catch (error) {
      console.error("Failed to save Tumblr config:", error);
      toast.error("Failed to save Tumblr configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      router.push("/");
    } catch (error) {
      console.error("Failed to logout:", error);
      toast.error("Failed to logout");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-4 relative min-h-screen pb-20">
      <h1 className="text-3xl font-bold">Profile Settings</h1>

      <UserProfileForm user={user} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image
              src="/icons/tumblr.svg"
              alt="Tumblr"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            Tumblr Setup
          </CardTitle>
          <CardDescription>
            Configure your Tumblr OAuth credentials to enable posting to Tumblr
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="consumerKey">Consumer Key</Label>
            <Input
              id="consumerKey"
              value={tumblrConfig.consumerKey}
              onChange={(e) =>
                setTumblrConfig((prev) => ({
                  ...prev,
                  consumerKey: e.target.value,
                }))
              }
              placeholder="Enter your Tumblr OAuth Consumer Key"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="consumerSecret">Consumer Secret</Label>
            <Input
              id="consumerSecret"
              type="password"
              value={tumblrConfig.consumerSecret}
              onChange={(e) =>
                setTumblrConfig((prev) => ({
                  ...prev,
                  consumerSecret: e.target.value,
                }))
              }
              placeholder="Enter your Tumblr OAuth Consumer Secret"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSaveTumblrConfig}
            disabled={isLoading}
            variant="ghost"
          >
            {isLoading ? "Saving..." : "Save Tumblr Configuration"}
          </Button>
        </CardFooter>
      </Card>

      <div className="absolute bottom-4 right-4">
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full sm:w-auto"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
