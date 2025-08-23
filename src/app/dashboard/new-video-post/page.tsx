import { getAlreadyScheduledDates } from "@/app/api/post/get-already-scheduled-dates";
import { getSocialMediaIntegrations } from "@/app/api/social-media-integration/get-social-media-integrations";
import { VideoPostForm } from "@/components/post-forms/video-post-form";

interface VideoPostPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function VideoPostPage({
  searchParams,
}: VideoPostPageProps) {
  const { date } = await searchParams;
  const integrations = await getSocialMediaIntegrations();
  const alreadyScheduledDates = await getAlreadyScheduledDates();

  return (
    <VideoPostForm
      integrations={integrations}
      initialDate={date}
      alreadyScheduledDates={alreadyScheduledDates}
    />
  );
}
