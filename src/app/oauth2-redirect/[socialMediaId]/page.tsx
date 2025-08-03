"use client";

import { addSocialMediaIntegration } from "@/app/api/social-media-integration/add-social-media-integration";
import { SocialMedia } from "@/generated/prisma";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function OAuthRedirectPage() {
  const { socialMediaId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      toast.error(`OAuth error: ${error}`);
      const returnUrl = sessionStorage.getItem('oauth_return_url') || '/dashboard/integrations';
      sessionStorage.removeItem('oauth_platform');
      sessionStorage.removeItem('oauth_brand_id');
      sessionStorage.removeItem('oauth_return_url');
      router.push(returnUrl);
      return;
    }

    const matchingSocialMedia = Object.values(SocialMedia).find(
      (socialMedia) =>
        socialMedia.toLowerCase() === (socialMediaId as string).toLowerCase()
    );

    if (!matchingSocialMedia) {
      toast.error(`Invalid social media platform: ${socialMediaId}`);
      const returnUrl = sessionStorage.getItem('oauth_return_url') || '/dashboard/integrations';
      sessionStorage.removeItem('oauth_platform');
      sessionStorage.removeItem('oauth_brand_id');
      sessionStorage.removeItem('oauth_return_url');
      router.push(returnUrl);
      return;
    }

    if (!code) {
      toast.error(`No authorization code provided`);
      const returnUrl = sessionStorage.getItem('oauth_return_url') || '/dashboard/integrations';
      sessionStorage.removeItem('oauth_platform');
      sessionStorage.removeItem('oauth_brand_id');
      sessionStorage.removeItem('oauth_return_url');
      router.push(returnUrl);
      return;
    }

    const createIntegration = async () => {
      try {
        await addSocialMediaIntegration(matchingSocialMedia, code, state, state);
        
        // Success - redirect back to the original page
        toast.success(`Connection established to ${matchingSocialMedia}`);
        const returnUrl = sessionStorage.getItem('oauth_return_url') || '/dashboard/integrations';
        sessionStorage.removeItem('oauth_platform');
        sessionStorage.removeItem('oauth_brand_id');
        sessionStorage.removeItem('oauth_return_url');
        router.push(returnUrl);
      } catch (error) {
        console.error("Failed to create integration:", error);
        
        // Error - redirect back to the original page
        toast.error(`Connection failed to ${matchingSocialMedia}`);
        const returnUrl = sessionStorage.getItem('oauth_return_url') || '/dashboard/integrations';
        sessionStorage.removeItem('oauth_platform');
        sessionStorage.removeItem('oauth_brand_id');
        sessionStorage.removeItem('oauth_return_url');
        router.push(returnUrl);
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
