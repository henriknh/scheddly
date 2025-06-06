import { Breadcrumb } from "@/components/common/breadcrumb";

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Breadcrumb label="Team" href="/dashboard/team" />
      {children}
    </div>
  );
}
