import type { Meta, StoryObj } from "@storybook/react-vite"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import i18n from "@/i18n"

const meta: Meta<any> = {
  title: "UI/Input/ToggleGroup",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { type: "single", size: "default", defaultValue: "today" },
  argTypes: {
    type: { control: "radio", options: ["single", "multiple"] },
    size: { control: "radio", options: ["default", "sm", "lg"] },
    defaultValue: { control: "text" },
  },
  render: (args: { type?: "single" | "multiple"; size?: "default" | "sm" | "lg"; defaultValue?: string }) => {
    const { type = "single", size = "default", defaultValue = "today" } = args
    if (type === "multiple") {
      return (
        <ToggleGroup type="multiple" size={size} defaultValue={[defaultValue].filter(Boolean)}>
          <ToggleGroupItem value="today">{i18n.t("task.today")}</ToggleGroupItem>
        <ToggleGroupItem value="evening">{i18n.t("view.thisEvening")}</ToggleGroupItem>
        <ToggleGroupItem value="someday">{i18n.t("task.someday")}</ToggleGroupItem>
        </ToggleGroup>
      )
    }
    return (
      <ToggleGroup type="single" size={size} defaultValue={defaultValue}>
        <ToggleGroupItem value="today">{i18n.t("task.today")}</ToggleGroupItem>
        <ToggleGroupItem value="evening">{i18n.t("view.thisEvening")}</ToggleGroupItem>
        <ToggleGroupItem value="someday">{i18n.t("task.someday")}</ToggleGroupItem>
      </ToggleGroup>
    )
  },
}

export const SingleSelect: StoryObj = {
  render: () => (
    <ToggleGroup type="single" defaultValue="today">
      <ToggleGroupItem value="today">{i18n.t("task.today")}</ToggleGroupItem>
      <ToggleGroupItem value="evening">{i18n.t("view.thisEvening")}</ToggleGroupItem>
      <ToggleGroupItem value="someday">{i18n.t("task.someday")}</ToggleGroupItem>
    </ToggleGroup>
  ),
}
