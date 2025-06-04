import { Breadcrumb } from "@/components/common/breadcrumb";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Breadcrumb label="Profile" href="/dashboard/profile" />
      {children}
    </div>
  );
}
