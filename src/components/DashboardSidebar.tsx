"use client";

import { useAuth } from "@/lib/auth-context";
import {
  Blocks,
  ChevronLeft,
  Home,
  ImageIcon,
  Users,
  LayoutDashboard,
  Plus,
  Tag,
  TextIcon,
  VideoIcon,
  StickyNote,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/common/UserAvatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  items?: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

const defaultItems = [
  {
    href: "/dashboard",
    title: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
];

export function DashboardSidebar({ items }: SidebarNavProps) {
  const pathname = usePathname();
  const navItems = items || defaultItems;
  const { user } = useAuth();
  const { open, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem
            className={cn("transition-all", open ? "pb-8 pt-4" : "pb-4")}
          >
            <SidebarMenuButton
              asChild
              tooltip="Social Ecom"
              size={"lg"}
              style={{
                padding: "8px !important",
              }}
            >
              <Link
                href="/dashboard"
                style={{
                  padding: "8px !important",
                }}
              >
                <Home className={cn("h-4 w-4", open ? "h-8 w-8" : "h-4 w-4")} />
                <span className={cn("text-lg", open ? "block" : "hidden")}>
                  Social Ecom
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size={"lg"}
                variant={"primary"}
                style={{
                  padding: "8px !important",
                }}
              >
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
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={pathname === item.href}
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/posts">
                  <StickyNote />
                  <span>Posts</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/brands">
                  <Tag />
                  <span>Brands</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/integrations">
                  <Blocks />
                  <span>Integrations</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Separator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2"
              >
                <Avatar
                  src={user?.avatarUrl || undefined}
                  fallback={user?.name || undefined}
                />
                <span className="truncate">{user?.name || "User"}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Team</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

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
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
