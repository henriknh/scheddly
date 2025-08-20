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
import { Alert, AlertDescription } from "../ui/alert";
import { Mail } from "lucide-react";

interface InvitationCardsProps {
  pendingInvitations: InvitationWithRelations[];
}

export function InvitationCards({ pendingInvitations }: InvitationCardsProps) {
  const router = useRouter();

  const onDeclineInvitation = async (invitationId: string) => {
    try {
      await declineInvitation(invitationId);
      toast.success("Invitation declined");
      router.refresh();
    } catch (error) {
      console.error("DECLINE_INVITE_UI_ERROR", error);
      toast.error("Failed to decline");
    }
  };

  const onAcceptInvitation = async (invitationId: string) => {
    try {
      await acceptInvitation(invitationId);
      toast.success("Invitation accepted");
      router.refresh();
    } catch (error) {
      console.error("ACCEPT_INVITE_UI_ERROR", error);
      toast.error("Failed to accept");
    }
  };

  return (
    <div className="space-y-4">
      {pendingInvitations.map((inv) => (
        <div key={inv.id}>
          <Alert>
            <span className="flex items-center justify-center">
              <Mail className="h-4 w-4" />
            </span>

            <AlertDescription className="flex justify-between items-center w-full">
              <div>Invitation to join {inv.team.name}</div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => onDeclineInvitation(inv.id)}
                >
                  Decline
                </Button>
                <Button onClick={() => onAcceptInvitation(inv.id)}>
                  Accept
                </Button>
              </div>
            </AlertDescription>
          </Alert>
          <Card>
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
                onClick={() => onDeclineInvitation(inv.id)}
              >
                Decline
              </Button>
              <Button onClick={() => onAcceptInvitation(inv.id)}>Accept</Button>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
}
