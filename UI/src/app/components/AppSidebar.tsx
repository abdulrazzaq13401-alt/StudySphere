import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "./ui/sidebar";
import {
  BookOpen,
  Building2,
  FileText,
  History,
  Info,
  Mail,
  School,
} from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas" variant="sidebar" className="border-r">
      <SidebarHeader className="pb-3">
        <div className="rounded-xl border border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_60%)] p-3">
          <div className="flex items-center gap-3">
            <div className="relative grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 shadow-[0_12px_32px_rgba(56,189,248,0.35)]">
              <span className="font-logo text-lg font-semibold text-white">S</span>
              <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-amber-300 shadow-[0_0_0_2px_rgba(255,255,255,0.6)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-logo text-base text-slate-900">StudySphere</span>
              <span className="text-xs text-slate-500">Knowledge hub</span>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Departments</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Departments" asChild>
                <a href="#departments">
                  <Building2 />
                  <span>Departments</span>
                </a>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <a href="#courses">
                      <School />
                      <span>Courses</span>
                    </a>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <a href="#documents">
                      <FileText />
                      <span>Documents</span>
                    </a>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <a href="#past-papers">
                      <History />
                      <span>Past papers</span>
                    </a>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Contact Us" asChild>
                <a href="#contact">
                  <Mail />
                  <span>Contact Us</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="About" asChild>
                <a href="#about">
                  <Info />
                  <span>About</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Library" asChild>
                <a href="#library">
                  <BookOpen />
                  <span>Library</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-2">
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
          Focused study, beautifully organized.
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
