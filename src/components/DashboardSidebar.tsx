"use client";

import { UserAvatar } from "@/components/common/UserAvatar";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useAuth } from "@/lib/auth-context";
import {
  Archive,
  Blocks,
  BugIcon,
  Building2,
  ChevronLeft,
  HomeIcon,
  ImageIcon,
  LayoutDashboard,
  Plus,
  TextIcon,
  Users,
  VideoIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { InvitationWithRelations } from "@/app/api/team/types";
import { MobileAwareSidebar } from "@/components/MobileAwareSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SubscriptionTier } from "@/generated/prisma";
import { subscriptionLabel } from "@/lib/subscription";
import { cn } from "@/lib/utils";
import Image from "next/image";
import config from "../../app.config";
import { TeamSelect } from "./team/TeamSelect";
import { Badge } from "./ui/badge";
import { CleanedUser } from "@/app/api/user/types";

interface DashboardSidebarProps {
  user: CleanedUser;
  pendingInvitations: InvitationWithRelations[];
}

export function DashboardSidebar({
  user,
  pendingInvitations,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  // const { user } = useAuth();
  const { open, toggleSidebar, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  const isDevMode = process.env.NODE_ENV === "development";

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <MobileAwareSidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem
            className={cn("transition-all", open ? "pb-8 pt-2" : "pb-4")}
          >
            <SidebarMenuButton
              asChild
              tooltip={config.appName}
              className="py-6"
            >
              <Link href="/dashboard" onClick={handleLinkClick}>
                <Image src="/logo.svg" alt="Logo" width={28} height={28} />

                <span className={cn("text-lg font-bold")}>
                  {config.appName}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="rounded" variant={"primary"}>
                <Plus className="h-4 w-4" />
                <span>Create Post</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-48">
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/create-new-post/text"
                  className="flex items-center gap-2"
                  onClick={handleLinkClick}
                >
                  <TextIcon className="h-4 w-4" />
                  <span>Text Post</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/create-new-post/image"
                  className="flex items-center gap-2"
                  onClick={handleLinkClick}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>Image Post</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/create-new-post/video"
                  className="flex items-center gap-2"
                  onClick={handleLinkClick}
                >
                  <VideoIcon className="h-4 w-4" />
                  <span>Video Post</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={"Dashboard"}
                isActive={pathname === "/dashboard"}
              >
                <Link href="/dashboard" onClick={handleLinkClick}>
                  <HomeIcon className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={"Posts"}
                isActive={pathname === "/dashboard/posts"}
              >
                <Link href="/dashboard/posts" onClick={handleLinkClick}>
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Posts</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={"Archive"}
                isActive={pathname === "/dashboard/archive"}
              >
                <Link href="/dashboard/archive" onClick={handleLinkClick}>
                  <Archive className="h-4 w-4" />
                  <span>Archive</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {user?.teams && user.teams.length > 1 && (
            <SidebarMenuItem>
              <TeamSelect user={user} />
            </SidebarMenuItem>
          )}

          {(user?.subscription?.subscriptionTier === SubscriptionTier.PRO ||
            pendingInvitations.length > 0) && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={"Team"}
                isActive={pathname === "/dashboard/team"}
              >
                <Link
                  href="/dashboard/team"
                  onClick={handleLinkClick}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Team</span>
                  </div>

                  {pendingInvitations.length > 0 && (
                    <div>
                      <Badge>{pendingInvitations.length}</Badge>
                    </div>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={"Brands"}
              isActive={pathname === "/dashboard/brands"}
            >
              <Link href="/dashboard/brands" onClick={handleLinkClick}>
                <Building2 className="h-4 w-4" />
                <span>Brands</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={"Integrations"}
              isActive={pathname === "/dashboard/integrations"}
            >
              <Link href="/dashboard/integrations" onClick={handleLinkClick}>
                <Blocks />
                <span>Integrations</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {isDevMode && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={"Debug"}
                isActive={pathname === "/dashboard/debug"}
              >
                <Link href="/dashboard/debug" onClick={handleLinkClick}>
                  <BugIcon />
                  <span>Debug</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={"Profile"}
              isActive={pathname === "/dashboard/profile"}
            >
              <Link
                href="/dashboard/profile"
                className={cn(
                  "flex items-center gap-2 w-full",
                  open ? "!h-14" : "!h-8"
                )}
                onClick={handleLinkClick}
              >
                <UserAvatar src={user?.avatar?.id} size={open ? "md" : "sm"} />

                <div className="flex flex-col overflow-hidden">
                  <span className="truncate">{user?.name || "User"}</span>

                  <span className="text-xs text-muted-foreground">
                    {subscriptionLabel(user?.subscription)}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {!isMobile && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={open ? "Collapse" : "Expand"}
                onClick={() => toggleSidebar()}
              >
                <ChevronLeft
                  className={`h-4 w-4 transition-transform ${
                    !open ? "rotate-180" : ""
                  }`}
                />
                <span>Collapse</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </MobileAwareSidebar>
  );
}
