import { SocialMediaIntegrationWithRelations } from "@/app/api/social-media-integration/types";
import { SubHeader } from "@/components/common/SubHeader";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { AddXCommunityModal } from "./AddXCommunityModal";
import { DeleteXCommunityModal } from "./DeleteXCommunityModal";

interface ManageXCommunitiesProps {
  integration: SocialMediaIntegrationWithRelations;
}

export function ManageXCommunities({ integration }: ManageXCommunitiesProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <SubHeader>Communities</SubHeader>
      </div>

      <div className="flex flex-wrap gap-2">
        {integration.xCommunities?.map((community) => (
          <div key={community.id}>
            <Button
              variant="outline"
              className="rounded-r-none"
              size="sm"
              asChild
            >
              <Link
                href={`https://x.com/i/communities/${community.xId}`}
                target="_blank"
              >
                <ExternalLinkIcon className="h-4 w-4" />
                {community.name}
              </Link>
            </Button>

            {/* <EditXCommunityModal community={community} /> */}

            <DeleteXCommunityModal community={community} />
          </div>
        ))}

        <AddXCommunityModal integration={integration} />
      </div>
    </div>
  );
}
