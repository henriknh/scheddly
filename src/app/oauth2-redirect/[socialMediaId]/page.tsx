"use client";

import { addSocialMediaIntegration } from "@/app/api/social-media-integration/add-social-media-integration";
import { SocialMedia } from "@/generated/prisma";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function PinterestRedirectPage() {
  const { socialMediaId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    const brandId = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      const storedPlatform = sessionStorage.getItem('oauth_platform');
      if (storedPlatform) {
        toast.error(`OAuth error: ${error}`);
        const returnUrl = sessionStorage.getItem('oauth_return_url') || '/dashboard/integrations';
        sessionStorage.removeItem('oauth_platform');
        sessionStorage.removeItem('oauth_brand_id');
        sessionStorage.removeItem('oauth_return_url');
        router.push(returnUrl);
        return;
      } else {
        const channel = new BroadcastChannel("oauth2_integration_complete");
        channel.postMessage({
          error: `[INTEGRATION_ERROR] OAuth error: ${error}`,
        });
        return;
      }
    }

    const matchingSocialMedia = Object.values(SocialMedia).find(
      (socialMedia) =>
        socialMedia.toLowerCase() === (socialMediaId as string).toLowerCase()
    );

    if (!matchingSocialMedia) {
      // Check if this is a mobile OAuth flow
      const storedPlatform = sessionStorage.getItem('oauth_platform');
      if (storedPlatform) {
        toast.error(`Invalid social media platform: ${socialMediaId}`);
        const returnUrl = sessionStorage.getItem('oauth_return_url') || '/dashboard/integrations';
        sessionStorage.removeItem('oauth_platform');
        sessionStorage.removeItem('oauth_brand_id');
        sessionStorage.removeItem('oauth_return_url');
        router.push(returnUrl);
        return;
      }

      const channel = new BroadcastChannel("oauth2_integration_complete");
      channel.postMessage({
        error: `[INTEGRATION_ERROR] Invalid social media id: ${socialMediaId}`,
      });
      return;
    }

    if (!code) {
      // Check if this is a mobile OAuth flow
      const storedPlatform = sessionStorage.getItem('oauth_platform');
      if (storedPlatform) {
        toast.error(`No authorization code provided`);
        const returnUrl = sessionStorage.getItem('oauth_return_url') || '/dashboard/integrations';
        sessionStorage.removeItem('oauth_platform');
        sessionStorage.removeItem('oauth_brand_id');
        sessionStorage.removeItem('oauth_return_url');
        router.push(returnUrl);
        return;
      }

      const channel = new BroadcastChannel("oauth2_integration_complete");
      channel.postMessage({
        error: `[INTEGRATION_ERROR][${matchingSocialMedia}] No code provided`,
      });
      return;
    }

    const createIntegration = async () => {
      try {
        await addSocialMediaIntegration(matchingSocialMedia, code, brandId);
        
        // Check if this is a mobile OAuth flow
        const storedPlatform = sessionStorage.getItem('oauth_platform');
        if (storedPlatform) {
          // Mobile flow - redirect back to the original page
          toast.success(`Connection established to ${matchingSocialMedia}`);
          const returnUrl = sessionStorage.getItem('oauth_return_url') || '/dashboard/integrations';
          sessionStorage.removeItem('oauth_platform');
          sessionStorage.removeItem('oauth_brand_id');
          sessionStorage.removeItem('oauth_return_url');
          router.push(returnUrl);
        } else {
          // Desktop flow - use BroadcastChannel
          const channel = new BroadcastChannel("oauth2_integration_complete");
          channel.postMessage({
            success: true,
          });
          window.close();
        }
      } catch (error) {
        console.error("Failed to create integration:", error);
        
        // Check if this is a mobile OAuth flow
        const storedPlatform = sessionStorage.getItem('oauth_platform');
        if (storedPlatform) {
          toast.error(`Connection failed to ${matchingSocialMedia}`);
          const returnUrl = sessionStorage.getItem('oauth_return_url') || '/dashboard/integrations';
          sessionStorage.removeItem('oauth_platform');
          sessionStorage.removeItem('oauth_brand_id');
          sessionStorage.removeItem('oauth_return_url');
          router.push(returnUrl);
        } else {
          const channel = new BroadcastChannel("oauth2_integration_complete");
          channel.postMessage({
            error: `[INTEGRATION_ERROR][${matchingSocialMedia}]`,
            errorDetails: error,
          });
        }
      } finally {
      }
    };

    createIntegration();
  }, [socialMediaId, router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-sm text-muted-foreground">Completing integration...</p>
      </div>
    </div>
  );
}
