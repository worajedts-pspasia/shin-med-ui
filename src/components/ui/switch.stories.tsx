import type { Meta, StoryObj } from "@storybook/react-vite"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import i18n from "@/i18n"

const meta: Meta<typeof Switch> = {
  title: "UI/Input/Switch",
  component: Switch,
  parameters: { layout: "padded" },
  args: { defaultChecked: true },
  argTypes: {
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  render: ({ defaultChecked, disabled }) => (
    <div className="flex items-center gap-2">
      <Switch id="sw" defaultChecked={defaultChecked} disabled={disabled} />
      <Label htmlFor="sw">{i18n.t("view.thisEvening")}</Label>
    </div>
  ),
}
export default meta

export const Playground: StoryObj<typeof Switch> = {}
