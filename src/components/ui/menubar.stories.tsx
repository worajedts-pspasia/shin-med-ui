import type { Meta, StoryObj } from "@storybook/react-vite"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import i18n from "@/i18n"

const meta: Meta = {
  title: "UI/Navigation/Menubar",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { menus: 2, itemLabel: "New To-Do" },
  argTypes: {
    menus: { control: { type: "range", min: 1, max: 3, step: 1 } },
    itemLabel: { control: "text" },
  },
  render: (args: { menus?: number; itemLabel?: string }) => {
    const { menus = 2, itemLabel = "" } = args
    const names = ["File", "View", "Go"]
    return (
      <Menubar>
        {names.slice(0, menus).map((n) => (
          <MenubarMenu key={n}>
            <MenubarTrigger>{n}</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>{itemLabel}</MenubarItem>
              <MenubarItem>Quick Find</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        ))}
      </Menubar>
    )
  },
}

export const FileMenu: StoryObj = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>{i18n.t("dialog.newTodo")}</MenubarItem>
          <MenubarItem>New List…</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>{i18n.t("task.today")}</MenubarItem>
          <MenubarItem>{i18n.t("sidebar.logbook")}</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}
