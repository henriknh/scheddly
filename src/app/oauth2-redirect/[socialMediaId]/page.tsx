"use client";

import { addSocialMediaIntegration } from "@/app/api/social-media-integration/add-social-media-integration";
import { SocialMedia } from "@/generated/prisma";
import { Loader2 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function OAuthRedirectPage() {
  const { socialMediaId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const socialMediaName = Object.values(SocialMedia).find(
    (socialMedia) =>
      socialMedia.toLowerCase() === (socialMediaId as string).toLowerCase()
  );

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      toast.error(`OAuth error: ${error}`);
      const returnUrl =
        sessionStorage.getItem("oauth_return_url") || "/dashboard/integrations";
      sessionStorage.removeItem("oauth_platform");
      sessionStorage.removeItem("oauth_brand_id");
      sessionStorage.removeItem("oauth_return_url");
      router.push(returnUrl);
      return;
    }

    const matchingSocialMedia = Object.values(SocialMedia).find(
      (socialMedia) =>
        socialMedia.toLowerCase() === (socialMediaId as string).toLowerCase()
    );

    if (!matchingSocialMedia) {
      toast.error(`Invalid social media platform: ${socialMediaId}`);
      const returnUrl =
        sessionStorage.getItem("oauth_return_url") || "/dashboard/integrations";
      sessionStorage.removeItem("oauth_platform");
      sessionStorage.removeItem("oauth_brand_id");
      sessionStorage.removeItem("oauth_return_url");
      router.push(returnUrl);
      return;
    }

    if (!code) {
      toast.error(`No authorization code provided`);
      const returnUrl =
        sessionStorage.getItem("oauth_return_url") || "/dashboard/integrations";
      sessionStorage.removeItem("oauth_platform");
      sessionStorage.removeItem("oauth_brand_id");
      sessionStorage.removeItem("oauth_return_url");
      router.push(returnUrl);
      return;
    }

    const createIntegration = async () => {
      try {
        await addSocialMediaIntegration(
          matchingSocialMedia,
          code,
          state || undefined
        );

        // Success - redirect back to the original page
        toast.success(`Connection established to ${socialMediaName}`);
        const returnUrl =
          sessionStorage.getItem("oauth_return_url") ||
          "/dashboard/integrations";
        sessionStorage.removeItem("oauth_platform");
        sessionStorage.removeItem("oauth_brand_id");
        sessionStorage.removeItem("oauth_return_url");
        router.push(returnUrl);
      } catch (error) {
        console.error("Failed to create integration:", error);

        // Error - redirect back to the original page
        toast.error(`Connection failed to ${socialMediaName}`);
        const returnUrl =
          sessionStorage.getItem("oauth_return_url") ||
          "/dashboard/integrations";
        sessionStorage.removeItem("oauth_platform");
        sessionStorage.removeItem("oauth_brand_id");
        sessionStorage.removeItem("oauth_return_url");
        router.push(returnUrl);
      }
    };

    createIntegration();
  }, [socialMediaId, router, searchParams, socialMediaName]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <p className="text-sm text-muted-foreground">
          Completing connection to {socialMediaName}...
        </p>
      </div>
    </div>
  );
}
