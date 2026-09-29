import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { FindingsChecklistGroup } from "./FindingsChecklistGroup"
import { AtDensity } from "./story-utils"
import { fixtureFindings } from "@/fixtures/clinic"

const meta: Meta<typeof FindingsChecklistGroup> = {
  title: "Medical/Medical Component/Findings Checklist Group",
  tags: ["autodocs"],
  component: FindingsChecklistGroup,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "The physical-exam checklist: one group per system, each item a checkbox, and the \"All Normal\" master that ticks the whole group in one move \u2014 the single biggest time-saver in the exam room.\n\n**Watch out:** \"All Normal\" is a clinical assertion. Unchecking one item after a bulk-normal must *un-assert* the master, not just disagree with it.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

function Demo({ columns = 2 }: { columns?: 1 | 2 | 3 }) {
  const [items, setItems] = useState(fixtureFindings.map((f) => ({ ...f, checked: false, abnormal: undefined as string | undefined })))
  return (
    <div className="max-w-xl">
      <FindingsChecklistGroup
        title="Diabetic foot exam" items={items} columns={columns}
        onToggle={(id, checked) => setItems((its) => its.map((i) => (i.id === id ? { ...i, checked } : i)))}
        onAbnormal={(id, value) => setItems((its) => its.map((i) => (i.id === id ? { ...i, abnormal: value } : i)))}
      />
    </div>
  )
}

export const Playground: Story = {
  argTypes: { columns: { control: "radio", options: [1, 2, 3] } } as unknown as Meta<typeof FindingsChecklistGroup>["argTypes"],
  args: { columns: 2 } as Record<string, unknown>,
  render: (args: any) => <Demo columns={args.columns} />,
}
