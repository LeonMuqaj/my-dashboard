"use client";

import {
  Home,
  Inbox,
  Calendar,
  Search,
  Settings,
  User2,
  Plus,
  Projector,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { useStore, useHydration } from "@/lib/store";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Posts",
    url: "/posts",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

const AppSidebar = () => {
  const hydrated = useHydration();
  // Get the actual number of posts from Zustand store
  const postsCount = useStore((state) => state.posts.length);
  const projectsCount = useStore((state) => state.projects.length);

  return (
    // Komplet Sidebari
    <Sidebar collapsible="icon">
      {/* Headeri */}
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Image src="/favicon.ico" alt="logo" width={20} height={20} />
                <span>Leoni Dev</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Menyt e Application  */}
      <SidebarContent>
        <SidebarGroup>
          {/* Labeli per me kallzu menyjat kryesore */}
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Menyt qe jena ti marr prej constit nelt */}
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.title === "Posts" && (
                    <SidebarMenuBadge>{postsCount}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Menyt per Projects */}
        <SidebarGroup>
          <SidebarGroupLabel> Projects</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/projects">
                    <Projector />
                    See All Projects
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge>
                  {hydrated ? projectsCount : "-"}
                </SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/projects/add">
                    <Plus />
                    Add a Project
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User2 /> Leoni Dev
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
