"use client";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import { SubHeader } from "../common/SubHeader";
import { SocialMediaPostStatus } from "./social-media-post-status";
import { SocialMediaIntegrationWithRelations } from "@/app/api/social-media-integration/types";

interface BrandsWithIntegrationsAndTheirStatusProps {
  post: PostWithRelations;
  integrations: SocialMediaIntegrationWithRelations[];
}

export function BrandsWithIntegrationsAndTheirStatuses({
  post,
  integrations,
}: BrandsWithIntegrationsAndTheirStatusProps) {
  const groupSocialMediaPostsByBrand = post.socialMediaPosts.reduce(
    (acc, socialMediaPost) => {
      const brand = socialMediaPost.brand;
      if (!acc[brand.id]) {
        acc[brand.id] = [];
      }
      acc[brand.id].push(socialMediaPost);
      return acc;
    },
    {} as Record<string, SocialMediaPostWithRelations[]>
  );

  return (
    <div className="space-y-6">
      {Object.entries(groupSocialMediaPostsByBrand).map(
        ([brandId, socialMediaPosts]) => (
          <div key={brandId} className="space-y-4">
            <SubHeader>{socialMediaPosts[0].brand.name}</SubHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
              {socialMediaPosts.map(
                (socialMediaPost: SocialMediaPostWithRelations) => (
                  <SocialMediaPostStatus
                    key={socialMediaPost.id}
                    post={post}
                    socialMediaPost={socialMediaPost}
                    integrations={integrations}
                  />
                )
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
