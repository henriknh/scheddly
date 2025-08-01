"use client";

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";
import { AddIntegrationModal } from "./AddIntegrationModal";

export function IntegrationsHeader() {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" size="sm" className="max-md:flex-1" asChild>
        <Link href="/dashboard/brands" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Manage brands
        </Link>
      </Button>

      <AddIntegrationModal />
    </div>
  );
}
