import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import { formatDateTime } from "@/lib/format-date";
import { getSocialMediaPlatform } from "@/lib/social-media-platforms";
import { SubHeader } from "../common/SubHeader";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface BrandsWithIntegrationsAndTheirStatusProps {
  post: PostWithRelations;
}

export function BrandsWithIntegrationsAndTheirStatus({
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
                (socialMediaPost: SocialMediaPostWithRelations) => {
                  const badge = (
                    <Badge
                      variant={
                        socialMediaPost.postedAt
                          ? "success"
                          : socialMediaPost.failedAt
                          ? "destructive"
                          : "warning"
                      }
                      key={socialMediaPost.id}
                      className="flex items-center gap-1"
                    >
                      {
                        getSocialMediaPlatform(
                          socialMediaPost.socialMediaIntegration.socialMedia
                        )?.name
                      }

                      {socialMediaPost.postedAt && (
                        <ExternalLink className="h-3 w-3" />
                      )}
                    </Badge>
                  );

                  return (
                    <Tooltip key={socialMediaPost.id}>
                      <TooltipTrigger>
                        {socialMediaPost.postedAt ? (
                          <Link href={"#"}>{badge}</Link>
                        ) : (
                          badge
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        {socialMediaPost.postedAt && (
                          <div>
                            Posted at{" "}
                            {formatDateTime(new Date(socialMediaPost.postedAt))}
                          </div>
                        )}
                        {socialMediaPost.failedAt && (
                          <div>
                            Failed at{" "}
                            {formatDateTime(new Date(socialMediaPost.failedAt))}
                          </div>
                        )}

                        {socialMediaPost.failedReason && (
                          <div>Error: {socialMediaPost.failedReason}</div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                }
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
