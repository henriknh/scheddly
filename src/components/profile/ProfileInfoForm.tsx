"use client";

import { Description } from "@/components/common/Description";
import { Header } from "@/components/common/Header";
import { HeaderGroup } from "@/components/common/HeaderGroup";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function ProfileInfoForm() {
  const { user, reloadUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: "",
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;

      if (selectedImage) {
        // If we have a new image, use FormData
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("avatar", selectedImage);

        response = await fetch("/api/user/profile", {
          method: "PATCH",
          body: formDataToSend,
        });
      } else {
        // If no new image, send JSON
        response = await fetch("/api/user/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
          }),
        });
      }

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      reloadUser();
      setFormData((prev) => ({ ...prev, avatar: "" }));
      router.refresh();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <HeaderGroup>
        <Header>Profile Information</Header>
        <Description>
          Update your profile information and email address
        </Description>
      </HeaderGroup>

      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <div
            onClick={handleAvatarClick}
            className="relative cursor-pointer group"
            role="button"
            aria-label="Change profile image"
          >
            <div className="relative">
              <UserAvatar src={formData.avatar || user?.avatar?.id} isBig />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-medium rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-center text-xs">
                Update avatar
              </div>
            </div>
          </div>
          <Input
            ref={fileInputRef}
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Enter your name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
