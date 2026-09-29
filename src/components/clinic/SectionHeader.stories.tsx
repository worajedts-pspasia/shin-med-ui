import type { Meta, StoryObj } from "@storybook/react-vite"
import { SectionHeader } from "./SectionHeader"
import { AtDensity } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof SectionHeader> = {
  title: "Medical/Medical UI/Section Header",
  tags: ["autodocs"],
  component: SectionHeader,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("SectionHeader"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  args: { title: "Allergies", meta: "Reviewed 05/02/2014" },
  argTypes: {
    title: { control: "text" },
    meta: { control: "text" },
    status: { control: "radio", options: ["none", "ok", "warn", "critical"] },
  },
  render: (args: any) => {
    const { title = "Allergies", meta, status = "none" } = args
    return <SectionHeader title={title} meta={meta} status={status} />
  },
}
export default meta

export const Playground: StoryObj<typeof SectionHeader> = {}

export const AllStates: StoryObj<typeof SectionHeader> = {
  render: () => (
    <div className="flex w-full max-w-[420px] flex-col gap-2 pt-2">
      <SectionHeader title="Allergies" meta="Reviewed 05/02/2014" />
      <SectionHeader title="Medications" meta="4 active" status="warn" />
      <SectionHeader title="Problems" status="critical" />
      <SectionHeader title="Timeline" />
    </div>
  ),
}
