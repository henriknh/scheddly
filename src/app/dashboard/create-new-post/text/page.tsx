"use client";

import { useRouter } from "next/navigation";
import { TextPostForm } from "@/components/post-forms/text-post-form";
import { Header } from "@/components/common/Header";

export default function TextPostPage() {
  const router = useRouter();

  const handleSubmit = async (data: {
    content: string;
    scheduledDate?: Date;
    integrationIds: string[];
  }) => {
    try {
      // TODO: Implement post creation
      console.log(data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Header>Create new text post</Header>
      <TextPostForm onSubmit={handleSubmit} onCancel={() => router.back()} />
    </div>
  );
}
