"use server";

import { Breadcrumb } from "@/components/common/breadcrumb";

export default async function ChangePlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Breadcrumb label="Profile" href="/dashboard/profile" />
      <Breadcrumb label="Change Plan" href="/dashboard/profile/change-plan" />

      {children}
    </div>
  );
}
