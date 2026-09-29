import type { Meta, StoryObj } from "@storybook/react-vite"
import { Toggle } from "@/components/ui/toggle"
import { Bold } from "lucide-react"

const meta: Meta<typeof Toggle> = {
  title: "UI/Input/Toggle",
  component: Toggle,
  parameters: { layout: "padded" },
  args: { variant: "default", size: "sm", defaultPressed: false },
  argTypes: {
    variant: { control: "radio", options: ["default", "outline"] },
    size: { control: "radio", options: ["default", "sm", "lg"] },
    defaultPressed: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  render: ({ variant, size, defaultPressed, disabled }) => (
    <Toggle variant={variant} size={size} defaultPressed={defaultPressed} disabled={disabled}>
      <Bold className="size-4" />
    </Toggle>
  ),
}
export default meta

export const Playground: StoryObj<typeof Toggle> = {}
