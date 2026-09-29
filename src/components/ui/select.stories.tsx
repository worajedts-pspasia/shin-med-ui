import type { Meta, StoryObj } from "@storybook/react-vite"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const meta: Meta<any> = {
  title: "UI/Input/Select",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { disabled: false },
  argTypes: { disabled: { control: "boolean" } },
  render: (args: { disabled?: boolean }) => {
    const { disabled = false } = args
    return (
    <div className="flex flex-col gap-1.5">
      <Label>Move to</Label>
      <Select defaultValue="inbox" disabled={disabled}>
        <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="inbox">Inbox</SelectItem>
          <SelectItem value="house">House</SelectItem>
          <SelectItem value="trip">Trip to Chiang Mai</SelectItem>
        </SelectContent>
      </Select>
    </div>
    )
  },
}

export const Destination: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <Label>Move to</Label>
      <Select defaultValue="inbox">
        <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="inbox">Inbox</SelectItem>
          <SelectItem value="house">House</SelectItem>
          <SelectItem value="trip">Trip to Chiang Mai</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}
