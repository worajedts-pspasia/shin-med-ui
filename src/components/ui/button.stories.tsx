import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const meta: Meta<typeof Button> = {
  title: "UI/Input/Button",
  component: Button,
  parameters: { layout: "padded" },
  args: { children: "Button", variant: "default", size: "default" },
  argTypes: {
    variant: { control: "radio", options: ["default", "destructive", "outline", "secondary", "ghost", "link"] },
    size: { control: "radio", options: ["default", "xs", "sm", "lg", "icon"] },
    disabled: { control: "boolean" },
    children: { control: "text", description: "Button label" },
  },
}
export default meta

export const Playground: StoryObj<typeof Button> = {
  args: { children: "Button" },
}

// Variants showcase (unchanged below)

export const Variants: StoryObj<typeof Button> = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
      <Button className="bg-things-blue hover:bg-things-blue-dark"><Plus className="size-4" /> Things blue</Button>
    </div>
  ),
}
