import { LogoutButton } from "@/components/profile/LogoutButton";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { ProfileInfoForm } from "@/components/profile/ProfileInfoForm";

export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <ProfileInfoForm />
      <PasswordChangeForm />
      <div className="flex justify-end">
        <LogoutButton />
      </div>
    </div>
  );
}
