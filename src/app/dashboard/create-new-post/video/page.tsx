"use client";

import { useRouter } from "next/navigation";
import { VideoPostForm } from "@/components/post-forms/video-post-form";
import { Header } from "@/components/common/Header";

export default function VideoPostPage() {
  const router = useRouter();

  const handleSubmit = async (data: {
    description: string;
    video: File;
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
      <Header>Create new video post</Header>
      <VideoPostForm onSubmit={handleSubmit} onCancel={() => router.back()} />
    </div>
  );
}
