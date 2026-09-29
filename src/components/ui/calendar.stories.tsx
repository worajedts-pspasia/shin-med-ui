import type { Meta, StoryObj } from "@storybook/react-vite"
import { Calendar } from "@/components/ui/calendar"

const meta: Meta = {
  title: "UI/Input/Calendar",
  parameters: { layout: "padded" },
}
export default meta

export const Playground: StoryObj = {
  args: { numberOfMonths: 1, weekStartsOn: 1, showOutsideDays: true, fixedWeeks: false },
  argTypes: {
    numberOfMonths: { control: { type: "range", min: 1, max: 3, step: 1 } },
    weekStartsOn: { control: "radio", options: [0, 1, 6] },
    showOutsideDays: { control: "boolean" },
    fixedWeeks: { control: "boolean" },
  },
  render: (args: { numberOfMonths?: number; weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; showOutsideDays?: boolean; fixedWeeks?: boolean }) => {
    const { numberOfMonths = 1, weekStartsOn = 1, showOutsideDays = true, fixedWeeks = false } = args
    return (
      <div className="rounded-xl border border-things-hairline p-2">
        <Calendar mode="single" className="rounded-md" numberOfMonths={numberOfMonths} weekStartsOn={weekStartsOn} showOutsideDays={showOutsideDays} fixedWeeks={fixedWeeks} />
      </div>
    )
  },
}

export const SingleMonth: StoryObj = {
  render: () => (
    <div className="rounded-xl border border-things-hairline p-2">
      <Calendar mode="single" className="rounded-md" />
    </div>
  ),
}
