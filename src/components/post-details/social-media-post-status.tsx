"use client";

import { postSocialMediaPost } from "@/app/api/post/post-social-media-post";
import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import { formatDateTime } from "@/lib/format-date";
import { getSocialMediaApiFunctions } from "@/lib/social-media-api-functions/social-media-api-functions";
import { getSocialMediaPlatform } from "@/lib/social-media-platforms";
import { cn } from "@/lib/utils";
import { ExternalLink, RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface SocialMediaPostStatusProps {
  post: PostWithRelations;
  socialMediaPost: SocialMediaPostWithRelations;
}

export function SocialMediaPostStatus({
  post,
  socialMediaPost,
}: SocialMediaPostStatusProps) {
  const [isPosting, setIsPosting] = useState(false);
  const router = useRouter();

  const socialMediaPlatform = useMemo(
    () =>
      getSocialMediaPlatform(
        socialMediaPost.socialMediaIntegration.socialMedia
      ),
    [socialMediaPost.socialMediaIntegration.socialMedia]
  );

  const socialMediaApiFunctions = useMemo(
    () =>
      getSocialMediaApiFunctions(
        socialMediaPost.socialMediaIntegration.socialMedia
      ),
    [socialMediaPost.socialMediaIntegration.socialMedia]
  );

  const badge = useMemo(
    () => (
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
        {socialMediaPlatform?.name}

        {socialMediaPost.postedAt ? (
          <ExternalLink className="h-3 w-3" />
        ) : (
          <RefreshCwIcon
            className={cn("h-3 w-3", isPosting && "animate-spin")}
          />
        )}
      </Badge>
    ),
    [
      socialMediaPost.postedAt,
      socialMediaPost.failedAt,
      socialMediaPost.id,
      socialMediaPlatform?.name,
      isPosting,
    ]
  );

  return (
    <Tooltip key={socialMediaPost.id}>
      <TooltipTrigger
        onClick={() => {
          if (socialMediaPost.postedAt) {
            return;
          }

          setIsPosting(true);
          postSocialMediaPost(post, socialMediaPost).finally(() => {
            setIsPosting(false);
            router.refresh();
          });
        }}
      >
        {socialMediaPost.postedAt ? (
          <Link
            href={socialMediaApiFunctions.externalPostUrl(socialMediaPost)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {badge}
          </Link>
        ) : (
          badge
        )}
      </TooltipTrigger>
      <TooltipContent>
        {socialMediaPost.postedAt ? (
          <div>
            Posted at {formatDateTime(new Date(socialMediaPost.postedAt))}
          </div>
        ) : (
          socialMediaPost.failedAt && (
            <>
              <div>
                Failed at {formatDateTime(new Date(socialMediaPost.failedAt))}
              </div>
              {socialMediaPost.failedReason && (
                <div>Error: {socialMediaPost.failedReason}</div>
              )}
            </>
          )
        )}
      </TooltipContent>
    </Tooltip>
  );
}
