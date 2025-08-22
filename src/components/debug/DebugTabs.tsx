"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export function DebugTabs() {
  const pathname = usePathname();
  const getCurrentTab = useCallback(() => {
    if (pathname.endsWith("/debug")) {
      return "debug";
    }

    const afterDebug = pathname.split("/debug/").pop();
    return afterDebug?.split("/").shift() || "debug";
  }, [pathname]);

  const [tab, setTab] = useState<string | undefined>(getCurrentTab);

  useEffect(() => {
    const tab = getCurrentTab();
    setTab(tab);
  }, [tab, pathname, getCurrentTab]);

  return (
    <Tabs defaultValue="overview" value={tab}>
      <TabsList>
        <Link href="/dashboard/debug">
          <TabsTrigger value="debug">Overview</TabsTrigger>
        </Link>
        <Link href="/dashboard/debug/users">
          <TabsTrigger value="users">Users</TabsTrigger>
        </Link>
        <Link href="/dashboard/debug/teams">
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </Link>
        <Link href="/dashboard/debug/actions">
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
}
