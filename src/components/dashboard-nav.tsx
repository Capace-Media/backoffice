"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Plus,
  FileStack,
} from "lucide-react";

const navigation = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Projects",
    items: [
      {
        title: "All Projects",
        url: "/dashboard/projects",
        icon: FolderKanban,
      },
      {
        title: "Create Project",
        url: "/dashboard/projects/create",
        icon: Plus,
      },
      {
        title: "Create Template",
        url: "/dashboard/projects/templates/create",
        icon: FileStack,
      },
    ],
  },
  {
    title: "Contracts",
    items: [
      {
        title: "All Contracts",
        url: "/dashboard/contracts",
        icon: FileText,
      },
      {
        title: "Create Contract",
        url: "/dashboard/contracts/create",
        icon: Plus,
      },
    ],
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarContent>
      {navigation.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
}

