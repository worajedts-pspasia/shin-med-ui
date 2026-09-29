import type { Meta, StoryObj } from "@storybook/react-vite"
import { InlineMetricChip } from "./InlineMetricChip"
import { AtDensity, ForcedLocale } from "./story-utils"

const meta: Meta<typeof InlineMetricChip> = {
  title: "Medical/Medical UI/Inline Metric Chip",
  tags: ["autodocs"],
  component: InlineMetricChip,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A measured value as a wearable \u2014 small, tinted, unit attached. `BP 128/78`, `SpO\u2082 96%`, `HbA1c 6.8` \u2014 each a compact chip that colors by tone (ok/amber/red) while keeping the number in tabular figures.\n\n**Watch out:** tone means clinical judgment, not decoration. If you can't defend why a value is amber, ship it neutral.",
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
