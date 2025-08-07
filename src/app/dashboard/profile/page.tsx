import { LogoutButton } from "@/components/profile/LogoutButton";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { ProfileInfoForm } from "@/components/profile/ProfileInfoForm";
import { Breadcrumb } from "@/components/common/breadcrumb";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <Breadcrumb label="Profile" href="/dashboard/profile" />
      <ProfileInfoForm />
      <PasswordChangeForm />
      <div className="flex justify-end">
        <LogoutButton />
      </div>
    </div>
  );
}
