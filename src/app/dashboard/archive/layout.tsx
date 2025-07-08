import { Breadcrumb } from "@/components/common/breadcrumb";

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Breadcrumb label="Archive" href="/dashboard/archive" />
      {children}
    </div>
  );
}
