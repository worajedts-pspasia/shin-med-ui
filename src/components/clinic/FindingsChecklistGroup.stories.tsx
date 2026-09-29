import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { FindingsChecklistGroup } from "./FindingsChecklistGroup"
import { AtDensity } from "./story-utils"
import { fixtureFindings } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof FindingsChecklistGroup> = {
  title: "Medical/Medical Component/Findings Checklist Group",
  tags: ["autodocs"],
  component: FindingsChecklistGroup,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("FindingsChecklistGroup"),
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
