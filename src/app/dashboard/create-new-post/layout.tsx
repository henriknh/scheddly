import { Breadcrumb } from "@/components/common/breadcrumb";

export default function CreateNewPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumb label="Create New Post" href="/dashboard/create-new-post" />

      {children}
    </>
  );
}
