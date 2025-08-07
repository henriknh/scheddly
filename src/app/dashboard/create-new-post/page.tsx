"use client";

import { CreateNewPost } from "@/components/dashboard/create-new-post";
import { Breadcrumb } from "@/components/common/breadcrumb";

export default function CreateNewPostPage() {
  return (
    <div>
      <Breadcrumb label="Create New Post" href="/dashboard/create-new-post" />
      <CreateNewPost />
    </div>
  );
}
