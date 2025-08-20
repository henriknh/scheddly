"use server";

import { Breadcrumb } from "@/components/common/breadcrumb";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
