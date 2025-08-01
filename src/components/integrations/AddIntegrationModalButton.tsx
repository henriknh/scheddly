import { SocialMediaIntegration } from "@/generated/prisma";
import { SocialMediaPlatform } from "@/lib/social-media-platforms";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface AddIntegrationModalProps {
  brandId?: string | null;
  integrations: SocialMediaIntegration[];
  socialMediaPlatform: SocialMediaPlatform;
  setIsAddModalOpen: (isAddModalOpen: boolean) => void;
}

export function AddIntegrationModalButton({
  brandId,
  integrations,
  socialMediaPlatform,
  setIsAddModalOpen,
}: AddIntegrationModalProps) {
  const router = useRouter();

  const handlePlatformSelect = async () => {
    const oauthPageUrl =
      await socialMediaPlatform.socialMediaApiFunctions.oauthPageUrl(brandId);

    if (oauthPageUrl) {
      const channel = new BroadcastChannel("oauth2_integration_complete");
      window.open(oauthPageUrl, "_blank");

      channel.onmessage = (event) => {
        const data = event?.data;

        if (data?.success) {
          toast.success(
            `Connection established to ${socialMediaPlatform.name}`
          );
          router.refresh();
        } else {
          console.error(data?.error || "Unknown integration error");
          toast.error(`Connection failed to ${socialMediaPlatform.name}`);
        }

        channel.close();
        setIsAddModalOpen(false);
      };
    }
  };

  const isConnected = integrations.some(
    (integration) => integration.socialMedia === socialMediaPlatform.id
  );

  return (
    <Button
      variant="outline"
      className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent transition-colors"
      onClick={handlePlatformSelect}
      disabled={isConnected}
    >
      <socialMediaPlatform.Icon className="h-8 w-8" />
      <span className="text-sm font-medium">{socialMediaPlatform.name}</span>
    </Button>
  );
}
