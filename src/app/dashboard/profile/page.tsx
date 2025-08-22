"use client";

import { CurrentSubscriptionCard } from "@/components/profile/CurrentSubscriptionCard";
import { LogoutButton } from "@/components/profile/LogoutButton";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { ProfileInfoForm } from "@/components/profile/ProfileInfoForm";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-lg space-y-8">
      <CurrentSubscriptionCard />
      <ProfileInfoForm />
      <PasswordChangeForm />
      <div className="flex justify-end">
        <LogoutButton />
      </div>
    </div>
  );
}
