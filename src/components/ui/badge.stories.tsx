import type { Meta, StoryObj } from "@storybook/react-vite"
import { Badge } from "@/components/ui/badge"

const meta: Meta<typeof Badge> = {
  title: "UI/Display/Badge",
  component: Badge,
  parameters: { layout: "padded" },
  args: { children: "Badge", variant: "default" },
  argTypes: {
    variant: { control: "radio", options: ["default", "secondary", "destructive", "outline", "ghost", "link"] },
    children: { control: "text" },
  },
}
export default meta

export const Playground: StoryObj<typeof Badge> = {}

export const Variants: StoryObj<typeof Badge> = {
  render: () => (
    <div className="flex gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}
