import { Breadcrumb } from "@/components/common/breadcrumb";
import { redirect } from "next/navigation";

export default function DebugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDevMode = process.env.NODE_ENV === "development";

  if (!isDevMode) {
    redirect("/dashboard");
  }

  return (
    <div>
      <Breadcrumb label="Debug" href="/dashboard/debug" />
      {children}
    </div>
  );
}
