import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { StepTabs } from "./StepTabs"
import { AtDensity, ForcedLocale } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof StepTabs> = {
  title: "Medical/Medical Shell/Step Tabs",
  tags: ["autodocs"],
  component: StepTabs,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("StepTabs"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta

type Story = StoryObj<typeof meta>

const STEPS = [
  { id: "receipt", label: "Receipt" },
  { id: "claim", label: "Claim" },
  { id: "scrub", label: "Scrub" },
  { id: "transmit", label: "Transmit" },
  { id: "response", label: "Response" },
  { id: "print", label: "Print Queue" },
]

function Demo({ activeId = "claim", completedIds = ["receipt"] }: { activeId?: string; completedIds?: string[] }) {
  const [active, setActive] = useState(activeId)
  return <StepTabs steps={STEPS} activeId={active} onSelect={setActive} completedIds={completedIds} />
}

export const Playground: Story = {
  argTypes: {
    activeId: { control: "select", options: STEPS.map((s) => s.id) },
    more: { control: "boolean", description: "mark earlier steps completed" },
  } as unknown as Meta<typeof StepTabs>["argTypes"],
  args: { activeId: "scrub", more: true } as Record<string, unknown>,
  render: (args: any) => {
    const idx = STEPS.findIndex((s) => s.id === args.activeId)
    return <Demo activeId={args.activeId} completedIds={args.more && idx > 0 ? STEPS.slice(0, idx).map((s) => s.id) : []} />
  },
}

export const Default: Story = { name: "Default", render: () => <Demo /> }

export const AllComplete: Story = {
  render: () => <Demo activeId="print" completedIds={STEPS.slice(0, 5).map((s) => s.id)} />,
}

export const Mobile: Story = {
  render: () => (
    <div className="max-w-[390px]">
      <Demo activeId="transmit" completedIds={["receipt", "claim", "scrub"]} />
    </div>
  ),
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <StepTabs
          steps={[
            { id: "receipt", label: "รับของ" },
            { id: "claim", label: "เคลม" },
            { id: "scrub", label: "ตรวจสอบ" },
            { id: "transmit", label: "ส่งข้อมูล" },
            { id: "print", label: "คิวพิมพ์" },
          ]}
          activeId="scrub"
          onSelect={() => {}}
          completedIds={["receipt", "claim"]}
        />
      </AtDensity>
    </ForcedLocale>
  ),
}

export const Japanese: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <StepTabs
          steps={[
            { id: "receipt", label: "รับของ" },
            { id: "claim", label: "เคลม" },
            { id: "scrub", label: "確認" },
            { id: "transmit", label: "送信" },
            { id: "print", label: "印刷キュー" },
          ]}
          activeId="scrub"
          onSelect={() => {}}
          completedIds={["receipt", "claim"]}
        />
      </AtDensity>
    </ForcedLocale>
  ),
}