"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import {
  subscriptionLabel,
  isTrialExpired,
  TRIAL_PERIOD_DAYS,
} from "@/lib/subscription";

import Link from "next/link";
import { Header } from "../common/Header";

export function CurrentSubscriptionCard() {
  const { user } = useAuth();

  if (!user?.team) {
    return null;
  }

  const team = user.team;
  const subscription = team.subscription;
  const label = subscriptionLabel(subscription);
  const trialExpired = isTrialExpired(team);
  const isOnTrial = !subscription;

  // Calculate trial end date
  const trialEndDate = new Date(team.createdAt);
  trialEndDate.setDate(trialEndDate.getDate() + TRIAL_PERIOD_DAYS);
  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Header>{label}</Header>
        </CardTitle>
        <CardDescription>
          {trialExpired && "Your trial has expired. Upgrade to continue."}
          {isOnTrial &&
            !trialExpired &&
            `Expires in ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}`}
          {subscription && "Renews in 30 days"}
        </CardDescription>
      </CardHeader>

      {(isOnTrial || trialExpired) && (
        <CardContent>
          <Separator className="mb-4" />
          <Button asChild className="w-full">
            <Link href="/dashboard/profile">
              {trialExpired ? "Upgrade Now" : "Upgrade Plan"}
            </Link>
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
