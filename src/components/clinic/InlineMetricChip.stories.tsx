import type { Meta, StoryObj } from "@storybook/react-vite"
import { InlineMetricChip } from "./InlineMetricChip"
import { AtDensity, ForcedLocale } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof InlineMetricChip> = {
  title: "Medical/Medical UI/Inline Metric Chip",
  tags: ["autodocs"],
  component: InlineMetricChip,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("InlineMetricChip"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  argTypes: { tone: { control: "radio", options: ["none", "ok", "warn", "critical"] } },
  args: { tone: "critical" } as Record<string, unknown>,
  render: (args: any) => <InlineMetricChip value="90%" label="Pre-Intervention" tone={args.tone} />,
}

export const Default: Story = {
  name: "Default",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <InlineMetricChip value="90%" label="Pre-Intervention" tone="critical" />
      <InlineMetricChip value="0%" label="Post-Intervention" tone="ok" />
      <InlineMetricChip value="TIMI 2" />
      <InlineMetricChip value="36.8" unit="°C" label="Temp" />
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <InlineMetricChip value="120/80" unit="mmHg" label="BP" />
      <InlineMetricChip value="98%" label="SpO₂" tone="ok" />
      <InlineMetricChip value="140/95" unit="mmHg" label="BP" tone="warn" />
      <InlineMetricChip value="7.1" unit="mmol/L" label="Glucose" tone="critical" />
    </div>
  ),
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <InlineMetricChip value="90%" label="ก่อนทำหัตถการ" tone="critical" />
      </AtDensity>
    </ForcedLocale>
  ),
}
