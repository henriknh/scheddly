"use client";

import { acceptInvitation } from "@/app/api/team/accept-invitation";
import { declineInvitation } from "@/app/api/team/decline-invitation";
import { InvitationWithRelations } from "@/app/api/team/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface InvitationCardsProps {
  pendingInvitations: InvitationWithRelations[];
}

export function InvitationCards({ pendingInvitations }: InvitationCardsProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {pendingInvitations.map((inv) => (
        <Card key={inv.id}>
          <CardHeader>
            <CardTitle>Invitation to join {inv.team.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              You were invited at {inv.email}
            </div>
          </CardContent>
          <CardFooter className="gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={async () => {
                try {
                  await declineInvitation(inv.id);
                  toast.success("Invitation declined");
                  router.refresh();
                } catch (error) {
                  console.error("DECLINE_INVITE_UI_ERROR", error);
                  toast.error("Failed to decline");
                }
              }}
            >
              Decline
            </Button>
            <Button
              onClick={async () => {
                try {
                  await acceptInvitation(inv.id);
                  toast.success("Invitation accepted");
                  router.refresh();
                } catch (error) {
                  console.error("ACCEPT_INVITE_UI_ERROR", error);
                  toast.error("Failed to accept");
                }
              }}
            >
              Accept
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
