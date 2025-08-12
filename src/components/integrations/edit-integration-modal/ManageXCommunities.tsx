import { SocialMediaIntegrationWithRelations } from "@/app/api/social-media-integration/types";
import { Caption } from "@/components/common/Caption";
import { SubHeader } from "@/components/common/SubHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name and ID</TableHead>
            <TableHead className="text-right">
              <AddXCommunityModal integration={integration} />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {integration.xCommunities && integration.xCommunities.length > 0 ? (
            integration.xCommunities?.map((community) => (
              <TableRow key={community.id}>
                <TableCell className="flex flex-col gap-0">
                  {community.name}
                  <Caption>{community.xId}</Caption>
                </TableCell>
                <TableCell className="text-right">
                  <DeleteXCommunityModal community={community} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="text-center">
                <Caption>No communities found</Caption>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
