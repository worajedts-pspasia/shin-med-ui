import type { Meta, StoryObj } from "@storybook/react-vite"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import i18n from "@/i18n"

const meta: Meta = {
  title: "UI/Navigation/NavigationMenu",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { items: 3 },
  argTypes: { items: { control: { type: "range", min: 2, max: 6, step: 1 } } },
  render: (args: { items?: number }) => {
    const { items = 3 } = args
    const labels: [string, string][] = [
      ["task.today", "Today"], ["sidebar.upcoming", "Upcoming"], ["sidebar.anytime", "Anytime"],
      ["task.someday", "Someday"], ["sidebar.logbook", "Logbook"], ["sidebar.areas", "Areas"],
    ]
    return (
      <NavigationMenu>
        <NavigationMenuList>
          {labels.slice(0, items).map(([key, en]) => (
            <NavigationMenuItem key={en}><NavigationMenuLink href="#">{i18n.t(key)}</NavigationMenuLink></NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    )
  },
}

export const Views: StoryObj = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem><NavigationMenuLink href="#">{i18n.t("task.today")}</NavigationMenuLink></NavigationMenuItem>
        <NavigationMenuItem><NavigationMenuLink href="#">{i18n.t("sidebar.upcoming")}</NavigationMenuLink></NavigationMenuItem>
        <NavigationMenuItem><NavigationMenuLink href="#">{i18n.t("sidebar.anytime")}</NavigationMenuLink></NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}
