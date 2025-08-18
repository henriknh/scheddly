import { LogoutButton } from "@/components/profile/LogoutButton";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { ProfileInfoForm } from "@/components/profile/ProfileInfoForm";
import { CurrentSubscriptionCard } from "@/components/profile/CurrentSubscriptionCard";
import { Breadcrumb } from "@/components/common/breadcrumb";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <Breadcrumb label="Profile" href="/dashboard/profile" />

      <div className="mx-auto max-w-lg space-y-8">
        <CurrentSubscriptionCard />
        <ProfileInfoForm />
        <PasswordChangeForm />
        <div className="flex justify-end">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
