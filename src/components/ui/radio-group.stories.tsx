import type { Meta, StoryObj } from "@storybook/react-vite"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import i18n from "@/i18n"

const meta: Meta<any> = {
  title: "UI/Input/RadioGroup",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { orientation: "vertical", defaultValue: "today" },
  argTypes: {
    orientation: { control: "radio", options: ["vertical", "horizontal"] },
    defaultValue: { control: "radio", options: ["today", "evening", "someday"] },
  },
  render: (args: { orientation?: "vertical" | "horizontal"; defaultValue?: string }) => {
    const { orientation = "vertical", defaultValue = "today" } = args
    return (
    <RadioGroup orientation={orientation} defaultValue={defaultValue} className="gap-2">
      <div className="flex items-center gap-2"><RadioGroupItem value="today" id="p1" /><Label htmlFor="p1">{i18n.t("task.today")}</Label></div>
      <div className="flex items-center gap-2"><RadioGroupItem value="evening" id="p2" /><Label htmlFor="p2">{i18n.t("view.thisEvening")}</Label></div>
      <div className="flex items-center gap-2"><RadioGroupItem value="someday" id="p3" /><Label htmlFor="p3">{i18n.t("task.someday")}</Label></div>
    </RadioGroup>
    )
  },
}

export const Bucket: StoryObj = {
  render: () => (
    <RadioGroup defaultValue="today" className="gap-2">
      <div className="flex items-center gap-2"><RadioGroupItem value="today" id="r1" /><Label htmlFor="r1">{i18n.t("task.today")}</Label></div>
      <div className="flex items-center gap-2"><RadioGroupItem value="evening" id="r2" /><Label htmlFor="r2">{i18n.t("view.thisEvening")}</Label></div>
      <div className="flex items-center gap-2"><RadioGroupItem value="someday" id="r3" /><Label htmlFor="r3">{i18n.t("task.someday")}</Label></div>
    </RadioGroup>
  ),
}
