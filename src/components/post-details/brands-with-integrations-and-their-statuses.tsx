"use client";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import { SubHeader } from "../common/SubHeader";
import { SocialMediaPostStatus } from "./social-media-post-status";

interface BrandsWithIntegrationsAndTheirStatusProps {
  post: PostWithRelations;
}

export function BrandsWithIntegrationsAndTheirStatuses({
  post,
}: BrandsWithIntegrationsAndTheirStatusProps) {
  const groupSocialMediaPostsByBrand = post.socialMediaPosts.reduce(
    (acc, socialMediaPost) => {
      const brand = socialMediaPost.socialMediaIntegration.brand;
      if (!brand) return acc;
      if (!acc[brand.id]) {
        acc[brand.id] = [];
      }
      acc[brand.id].push(socialMediaPost);
      return acc;
    },
    {} as Record<string, SocialMediaPostWithRelations[]>
  );

  return (
    <div className="space-y-4">
      {Object.entries(groupSocialMediaPostsByBrand).map(
        ([brandId, socialMediaPosts]) => (
          <div key={brandId} className="space-y-2">
            <SubHeader>
              {socialMediaPosts[0].socialMediaIntegration.brand?.name ||
                socialMediaPosts[0].socialMediaIntegration.accountName}
            </SubHeader>
            <div className="flex flex-wrap gap-1">
              {socialMediaPosts.map(
                (socialMediaPost: SocialMediaPostWithRelations) => (
                  <SocialMediaPostStatus
                    key={socialMediaPost.id}
                    post={post}
                    socialMediaPost={socialMediaPost}
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
