import { VideoPostForm } from "@/components/post-forms/video-post-form";
import { Header } from "@/components/common/Header";
import { getSocialMediaIntegrations } from "@/app/api/social-media-integration/get-social-media-integrations";
import { Breadcrumb } from "@/components/common/breadcrumb";

interface VideoPostPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function VideoPostPage({ searchParams }: VideoPostPageProps) {
  const { date } = await searchParams;
  const integrations = await getSocialMediaIntegrations();

  return (
    <div className="space-y-4">
      <Breadcrumb label="Video" href="/dashboard/create-new-post/video" />
      <Header>Create new video post</Header>
      <VideoPostForm integrations={integrations} initialDate={date} />
    </div>
  );
}
