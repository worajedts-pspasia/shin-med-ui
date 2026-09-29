import type { Meta, StoryObj } from "@storybook/react-vite"
import { MetricTile } from "./MetricTile"
import { AtDensity, ForcedLocale } from "./story-utils"

const meta: Meta<typeof MetricTile> = {
  title: "Medical/Medical UI/Metric Tile",
  tags: ["autodocs"],
  component: MetricTile,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "One number, large and proud \u2014 the \"38 visits today\" glance. Label on top, big tabular value with its unit, optional timestamp, tone for the at-a-glance verdict, plus sparkline and footnote rows for trend context.\n\n**Watch out:** a tile answers one question. If it needs a paragraph of explanation, it wants to be a card, not a tile.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  argTypes: {
    tone: { control: "radio", options: ["none", "ok", "warn", "critical"] },
    withSpark: { control: "boolean" },
    withFootnotes: { control: "boolean" },
  } as unknown as Meta<typeof MetricTile>["argTypes"],
  args: { tone: "none", withSpark: true, withFootnotes: true } as Record<string, unknown>,
  render: (args: any) => (
    <div className="max-w-xs">
      <MetricTile
        label="Blood pressure"
        value="140/95"
        unit="mmHg"
        at="Sep 10, 2026"
        tone={args.tone}
        sparkline={args.withSpark ? [146, 144, 141, 139, 138, 140] : undefined}
        footnote={args.withFootnotes ? [
          { label: "Avg (6 visits)", value: "141/91" },
          { label: "Highest", value: "146/93", tone: "critical" },
        ] : undefined}
      />
    </div>
  ),
}

export const Default: Story = {
  name: "Default",
  render: () => (
    <div className="grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
      <MetricTile label="Blood pressure" value="140/95" unit="mmHg" at="Sep 10" tone="warn" sparkline={[146, 144, 141, 139, 138, 140]} />
      <MetricTile label="BMI" value="26.8" at="Sep 10" sparkline={[27.4, 27.2, 27.0, 26.9, 26.8]} />
      <MetricTile label="LDL" value="115" unit="mg/dL" tone="warn" at="Sep 9" footnote={[{ label: "Optimal", value: "< 100" }]} />
      <MetricTile label="eGFR" value="62" unit="mL/min" tone="ok" at="Sep 9" footnote={[{ label: "Stage", value: "G2" }]} />
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
      <MetricTile label="Neutral" value="76" unit="/min" at="09:52" />
      <MetricTile label="Normal" value="98" unit="%" tone="ok" />
      <MetricTile label="Abnormal" value="140/95" unit="mmHg" tone="warn" />
      <MetricTile label="Critical" value="7.1" unit="mmol/L" tone="critical" />
      <MetricTile label="With footnotes" value="6.8" unit="%"
        footnote={[{ label: "Target", value: "< 7.0", tone: "ok" }, { label: "Previous", value: "7.4", tone: "warn" }]} />
      <MetricTile label="Clickable" value="42" onSelect={() => {}} />
    </div>
  ),
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <div className="max-w-xs">
          <MetricTile label="ความดันโลหิต" value="140/95" unit="mmHg" at="10 ก.ย. 2569" tone="warn" />
        </div>
      </AtDensity>
    </ForcedLocale>
  ),
}
