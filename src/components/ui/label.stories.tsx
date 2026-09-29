import type { Meta, StoryObj } from "@storybook/react-vite"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import i18n from "@/i18n"

const meta: Meta<typeof Label> = {
  title: "UI/Display/Label",
  component: Label,
  parameters: { layout: "padded" },
  args: { children: "When" },
  argTypes: {
    children: { control: "text" },
  },
  render: ({ children }) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="lbl">{children}</Label>
      <Input id="lbl" placeholder={i18n.t("task.today")} />
    </div>
  ),
}
export default meta

export const Playground: StoryObj<typeof Label> = {}
