"use client";

import { UserAvatar } from "@/components/common/UserAvatar";
import { useAuth } from "@/lib/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Archive,
  Blocks,
  BugIcon,
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
import { MobileAwareSidebar } from "@/components/MobileAwareSidebar";
import config from "../../app.config";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { open, toggleSidebar, isMobile } = useSidebar();
  const isMobileHook = useIsMobile();

  const isDevMode = process.env.NODE_ENV === "development";
  const isMobileDevice = isMobile || isMobileHook;

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
              <Link href="/dashboard">
                <Image src="/logo.svg" alt="Logo" width={20} height={20} />

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
                >
                  <TextIcon className="h-4 w-4" />
                  <span>Text Post</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/create-new-post/image"
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>Image Post</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/create-new-post/video"
                  className="flex items-center gap-2"
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
                <Link href="/dashboard">
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
                <Link href="/dashboard/posts">
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
                <Link href="/dashboard/archive">
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
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={"Profile"}
              isActive={pathname === "/dashboard/profile"}
            >
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2"
              >
                <UserAvatar src={user?.avatar?.id} />
                <span className="truncate">{user?.name || "User"}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={"Team"}
              isActive={pathname === "/dashboard/team"}
            >
              <Link href="/dashboard/team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Team</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={"Integrations"}
              isActive={pathname === "/dashboard/integrations"}
            >
              <Link href="/dashboard/integrations">
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
                <Link href="/dashboard/debug">
                  <BugIcon />
                  <span>Debug</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {!isMobileDevice && (
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
