import { Breadcrumb } from "@/components/common/breadcrumb";

export default function IntegrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Breadcrumb label="Integrations" href="/dashboard/integrations" />
      {children}
    </div>
  );
}
