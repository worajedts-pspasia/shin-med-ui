import type { Meta, StoryObj } from "@storybook/react-vite"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import i18n from "@/i18n"

const meta: Meta = {
  title: "UI/Containers/Sidebar",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { collapsible: "icon", active: "Today" },
  argTypes: {
    collapsible: { control: "radio", options: ["icon", "offcanvas", "none"] },
    active: { control: "radio", options: ["Today", "Upcoming"] },
  },
  render: (args: { collapsible?: "icon" | "offcanvas" | "none"; active?: string }) => {
    const { collapsible = "icon", active = "Today" } = args
    return (
      <SidebarProvider className="h-64 min-h-0 rounded-xl border border-things-hairline">
        <Sidebar collapsible={collapsible}>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Views</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem><SidebarMenuButton isActive={active === "Today"}>{i18n.t("task.today")}</SidebarMenuButton></SidebarMenuItem>
                  <SidebarMenuItem><SidebarMenuButton isActive={active === "Upcoming"}>{i18n.t("sidebar.upcoming")}</SidebarMenuButton></SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex flex-1 items-center gap-2 p-4">
          <SidebarTrigger />
          <span className="text-[13px] text-things-ink">Content pane</span>
        </main>
      </SidebarProvider>
    )
  },
}

export const AppShellPreview: StoryObj = {
  render: () => (
    <SidebarProvider className="h-64 min-h-0 rounded-xl border border-things-hairline">
      <Sidebar collapsible="icon">
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Views</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem><SidebarMenuButton isActive>{i18n.t("task.today")}</SidebarMenuButton></SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuButton>{i18n.t("sidebar.upcoming")}</SidebarMenuButton></SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex flex-1 items-center gap-2 p-4">
        <SidebarTrigger />
        <span className="text-[13px] text-things-ink">Content pane</span>
      </main>
    </SidebarProvider>
  ),
}
