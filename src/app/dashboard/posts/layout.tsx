import { Breadcrumb } from "@/components/common/breadcrumb";

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumb label="Posts" href="/dashboard/posts" />

      {children}
    </>
  );
}
