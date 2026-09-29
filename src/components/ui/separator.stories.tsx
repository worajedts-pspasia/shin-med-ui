import type { Meta, StoryObj } from "@storybook/react-vite"
import { Separator } from "@/components/ui/separator"
import i18n from "@/i18n"

const meta: Meta<typeof Separator> = {
  title: "UI/Display/Separator",
  component: Separator,
  parameters: { layout: "padded" },
  args: { orientation: "horizontal" },
  argTypes: {
    orientation: { control: "radio", options: ["horizontal", "vertical"] },
  },
  render: ({ orientation }) =>
    orientation === "horizontal" ? (
      <Separator className="w-64" />
    ) : (
      <div className="flex h-16 items-center gap-4">
        <span className="text-[13px] text-things-ink">Morning</span>
        <Separator orientation="vertical" />
        <span className="text-[13px] text-things-gray">{i18n.t("view.thisEvening")}</span>
      </div>
    ),
}
export default meta

export const Playground: StoryObj<typeof Separator> = {}
