"use client";

import { useRouter } from "next/navigation";
import { ImagePostForm } from "@/components/post-forms/image-post-form";
import { Header } from "@/components/common/Header";

export default function ImagePostPage() {
  const router = useRouter();

  const handleSubmit = async (data: {
    caption: string;
    images: File[];
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
      <Header>Create new image post</Header>
      <ImagePostForm onSubmit={handleSubmit} onCancel={() => router.back()} />
    </div>
  );
}
