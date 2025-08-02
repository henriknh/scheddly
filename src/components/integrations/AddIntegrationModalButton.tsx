import { SocialMediaPlatform } from "@/lib/social-media-platforms";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface AddIntegrationModalProps {
  brandId?: string | null;
  socialMediaPlatform: SocialMediaPlatform;
  setIsAddModalOpen: (isAddModalOpen: boolean) => void;
}

export function AddIntegrationModalButton({
  brandId,
  socialMediaPlatform,
  setIsAddModalOpen,
}: AddIntegrationModalProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);

  const handlePlatformSelect = async () => {
    setIsLoading(true);
    
    try {
      const oauthPageUrl =
        await socialMediaPlatform.socialMediaApiFunctions.oauthPageUrl(brandId);

      if (oauthPageUrl) {
        if (isMobile) {
          // For mobile devices, redirect in the same window
          // Store the platform info in sessionStorage for when we return
          sessionStorage.setItem('oauth_platform', socialMediaPlatform.id);
          sessionStorage.setItem('oauth_brand_id', brandId || '');
          sessionStorage.setItem('oauth_return_url', window.location.href);
          
          // Show a toast to inform the user
          toast.info(`Redirecting to ${socialMediaPlatform.name}...`);
          
          // Redirect to OAuth URL in the same window
          window.location.href = oauthPageUrl;
        } else {
          // For desktop, use the existing popup approach
          const channel = new BroadcastChannel("oauth2_integration_complete");
          const popup = window.open(oauthPageUrl, "_blank");
          
          // Check if popup was blocked
          if (!popup) {
            toast.error("Popup blocked. Please allow popups for this site and try again.");
            return;
          }

          // Set up a timeout to handle cases where the popup might not work
          const timeout = setTimeout(() => {
            channel.close();
            toast.error("OAuth process timed out. Please try again.");
            setIsAddModalOpen(false);
          }, 60000); // 60 second timeout

          channel.onmessage = (event) => {
            clearTimeout(timeout);
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
      }
    } catch (error) {
      console.error("Failed to initiate OAuth flow:", error);
      toast.error(`Failed to connect to ${socialMediaPlatform.name}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent transition-colors"
      onClick={handlePlatformSelect}
      disabled={isLoading}
    >
      <socialMediaPlatform.Icon className="h-8 w-8" />
      <span className="text-sm font-medium">
        {isLoading ? "Connecting..." : socialMediaPlatform.name}
      </span>
    </Button>
  );
}
