import {
  Home,
  Inbox,
  Calendar,
  Search,
  Settings,
  User2,
  Plus,
  Projector,
//   ChevronDown,
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
// import {
//   DropdownMenu,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "./ui/dropdown-menu";
// import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

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
    url: "#",
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
                  {item.title==="Posts" && (
                    <SidebarMenuBadge>24</SidebarMenuBadge>
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
              <Link href="/#">
               <Projector/>
               See All Projects
              </Link>
             </SidebarMenuButton>   
            </SidebarMenuItem>
             <SidebarMenuItem>
             <SidebarMenuButton asChild>
              <Link href="/#">
               <Plus/>
               Add a Project
              </Link>
             </SidebarMenuButton>   
            </SidebarMenuItem>  
           </SidebarMenu> 
          </SidebarGroupContent>
        </SidebarGroup>

              

             
              
           
      </SidebarContent>
      {/* Sidebar i footerit */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild> */}
                <SidebarMenuButton>
                  <User2 /> John Doe
                </SidebarMenuButton>
              {/* </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem> Account </DropdownMenuItem>
                <DropdownMenuItem> Settings </DropdownMenuItem>
                <DropdownMenuItem> Sign out </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
