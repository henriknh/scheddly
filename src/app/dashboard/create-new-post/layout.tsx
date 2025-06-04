import { Breadcrumb } from "@/components/common/breadcrumb";

export default function CreateNewPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Breadcrumb label="Create New Post" href="/dashboard/create-new-post" />
      {children}
    </div>
  );
}
