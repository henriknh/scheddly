"use server";

import { Breadcrumb } from "@/components/common/breadcrumb";

export default async function DebugPage() {
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb label="Debug" href="/dashboard/debug" />

      <div>Overview</div>
    </div>
  );
}
