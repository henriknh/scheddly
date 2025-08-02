import { SocialMediaPlatform } from "@/lib/social-media-platforms";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
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
  const [isLoading, setIsLoading] = useState(false);

  const handlePlatformSelect = async () => {
    setIsLoading(true);
    
    try {
      const oauthPageUrl =
        await socialMediaPlatform.socialMediaApiFunctions.oauthPageUrl(brandId);

      if (oauthPageUrl) {
        // Store the platform info in sessionStorage for when we return
        sessionStorage.setItem('oauth_platform', socialMediaPlatform.id);
        sessionStorage.setItem('oauth_brand_id', brandId || '');
        sessionStorage.setItem('oauth_return_url', window.location.href);
        
        // Show a toast to inform the user
        toast.info(`Redirecting to ${socialMediaPlatform.name}...`);
        
        // Redirect to OAuth URL in the same window (works for all devices)
        window.location.href = oauthPageUrl;
      }
    } catch (error) {
      console.error("Failed to initiate OAuth flow:", error);
      toast.error(`Failed to connect to ${socialMediaPlatform.name}`);
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
