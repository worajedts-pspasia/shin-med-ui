import type { Meta, StoryObj } from "@storybook/react-vite"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"

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
    const labels = ["Today", "Upcoming", "Anytime", "Someday", "Logbook", "Areas"]
    return (
      <NavigationMenu>
        <NavigationMenuList>
          {labels.slice(0, items).map((l) => (
            <NavigationMenuItem key={l}><NavigationMenuLink href="#">{l}</NavigationMenuLink></NavigationMenuItem>
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
        <NavigationMenuItem><NavigationMenuLink href="#">Today</NavigationMenuLink></NavigationMenuItem>
        <NavigationMenuItem><NavigationMenuLink href="#">Upcoming</NavigationMenuLink></NavigationMenuItem>
        <NavigationMenuItem><NavigationMenuLink href="#">Anytime</NavigationMenuLink></NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}
