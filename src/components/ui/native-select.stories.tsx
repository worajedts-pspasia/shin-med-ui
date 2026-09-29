import type { Meta, StoryObj } from "@storybook/react-vite"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

const meta: Meta<any> = {
  title: "UI/Input/NativeSelect",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { disabled: false, defaultValue: "en" },
  argTypes: {
    disabled: { control: "boolean" },
    defaultValue: { control: "radio", options: ["en", "th", "ja"] },
  },
  render: (args: { disabled?: boolean; defaultValue?: string }) => {
    const { disabled = false, defaultValue = "today" } = args
    return (
    <NativeSelect defaultValue={defaultValue} disabled={disabled} className="w-40">
      <NativeSelectOption value="en">English</NativeSelectOption>
      <NativeSelectOption value="th">ไทย</NativeSelectOption>
      <NativeSelectOption value="ja">日本語</NativeSelectOption>
    </NativeSelect>
    )
  },
}

export const Language: StoryObj = {
  render: () => (
    <NativeSelect defaultValue="en" className="w-40">
      <NativeSelectOption value="en">English</NativeSelectOption>
      <NativeSelectOption value="th">ไทย</NativeSelectOption>
      <NativeSelectOption value="ja">日本語</NativeSelectOption>
    </NativeSelect>
  ),
}
