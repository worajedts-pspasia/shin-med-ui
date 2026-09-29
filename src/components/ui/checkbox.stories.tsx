import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const meta: Meta<typeof Checkbox> = {
  title: "UI/Input/Checkbox",
  component: Checkbox,
  parameters: { layout: "padded" },
  args: { checked: true },
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  render: ({ checked, disabled }) => (
    <div className="flex items-center gap-2">
      <Checkbox id="cb" checked={checked} disabled={disabled} />
      <Label htmlFor="cb">Work</Label>
    </div>
  ),
}
export default meta

export const Playground: StoryObj<typeof Checkbox> = {}
