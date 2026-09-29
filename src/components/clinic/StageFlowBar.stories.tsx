import type { Meta, StoryObj } from "@storybook/react-vite"
import { StageFlowBar } from "./StageFlowBar"
import { AtDensity, ForcedLocale } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

// Meta<any>: the playground takes comma-separated strings for `stages` and
// `inactive` and splits them in render — friendlier controls than raw arrays.
const meta: Meta<any> = {
  title: "Medical/Medical UI/Stage Flow Bar",
  tags: ["autodocs"],
  component: StageFlowBar,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("StageFlowBar") } },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  args: {
    stages: "Lead In, Contact Made, Demo Scheduled, Proposal, Contract Sent",
    current: 3,
    inactive: "",
    unit: "days",
  },
  argTypes: {
    stages: { control: "text", description: "Comma-separated stage labels" },
    current: { control: { type: "number", min: 1, max: 9 } },
    inactive: { control: "text", description: "Comma-separated 1-based indices of skipped stages" },
    unit: { control: "text" },
  },
  render: (args: any) => {
    const stages = String(args.stages)
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean)
    const inactive = String(args.inactive ?? "")
      .split(",")
      .map((s: string) => Number(s.trim()))
      .filter((n: number) => Number.isFinite(n) && n > 0)
    return (
      <StageFlowBar
        stages={stages}
        current={args.current}
        inactive={inactive}
        unit={args.unit}
        durations={{ 1: 1, 2: 0, 3: 4 }}
        onStageSelect={(n) => console.log("stage", n)}
      />
    )
  },
}
export default meta

export const Playground: StoryObj<typeof meta> = {}

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <StageFlowBar
      stages={["Lead In", "Contact Made", "Demo Scheduled", "Proposal", "Contract Sent"]}
      current={3}
      durations={{ 1: 0, 2: 0, 3: 4 }}
    />
  ),
}

export const AllStates: StoryObj<typeof meta> = {
  render: () => (
    <div className="flex max-w-[640px] flex-col gap-4 pt-2">
      <StageFlowBar stages={["A", "B", "C"]} current={1} />
      <StageFlowBar stages={["A", "B", "C"]} current={2} durations={{ 1: 3 }} />
      <StageFlowBar stages={["A", "B", "C", "D"]} current={3} inactive={[4]} durations={{ 1: 0, 2: 7 }} />
      <StageFlowBar stages={["A", "B", "C"]} current={3} durations={{ 1: 1, 2: 2, 3: 0 }} />
    </div>
  ),
}

export const Dense: StoryObj<typeof meta> = {
  render: () => (
    <StageFlowBar stages={["A", "B", "C", "D"]} current={2} dense durations={{ 1: 2 }} />
  ),
}

export const Thai: StoryObj<typeof meta> = {
  render: () => (
    <ForcedLocale locale="th">
      <StageFlowBar
        stages={["ลงทะเบียน", "พบแพทย์", "ตรวจผล", "ส่งต่อ", "นัดติดตาม"]}
        current={3}
        inactive={[4]}
        unit="วัน"
        durations={{ 1: 1, 2: 0, 3: 4 }}
      />
    </ForcedLocale>
  ),
}
