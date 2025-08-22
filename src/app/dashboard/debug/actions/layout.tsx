"use server";

import { Breadcrumb } from "@/components/common/breadcrumb";

export default async function DebugActionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumb label="Actions" href="/dashboard/debug/actions" />

      {children}
    </>
  );
}
