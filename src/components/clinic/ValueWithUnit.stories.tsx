import type { Meta, StoryObj } from "@storybook/react-vite"
import { ValueWithUnit } from "./ValueWithUnit"
import { AtDensity } from "./story-utils"

const meta: Meta<typeof ValueWithUnit> = {
  title: "Medical/Medical UI/Value With Unit",
  tags: ["autodocs"],
  component: ValueWithUnit,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A clinical value is never a bare number \u2014 `6.8 %` with the unit in quiet gray, the value in tabular figures, an optional reference range beside. Columns of these align on the decimal point because humans compare downward.\n\n**Watch out:** units travel with values everywhere or nowhere. If one table strips units and another keeps them, clinicians stop trusting both.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  args: { value: "120", unit: "mg/dL", range: ["70", "99"] },
  argTypes: {
    value: { control: "text" },
    unit: { control: "text" },
    range: { control: "object", description: "[low, high] — shown as tooltip" },
    tone: { control: "radio", options: ["none", "ok", "warn", "critical"] },
  },
  render: (args: any) => {
    const { value = "", unit, range, tone = "none" } = args
    return <ValueWithUnit value={value} unit={unit} range={range} tone={tone} />
  },
}
export default meta

export const Playground: StoryObj<typeof ValueWithUnit> = {}

export const AllStates: StoryObj<typeof ValueWithUnit> = {
  render: () => (
    <div className="flex flex-col gap-2">
      <ValueWithUnit value="98" unit="mg/dL" range={["70", "99"]} tone="ok" />
      <ValueWithUnit value="120" unit="mg/dL" range={["70", "99"]} tone="warn" />
      <ValueWithUnit value={["140", "95"]} unit="mmHg" tone="warn" />
      <ValueWithUnit value="6.8" unit="mmol/L" range={["3.9", "5.5"]} tone="critical" />
      <ValueWithUnit value="—" />
    </div>
  ),
}

export const Dense: StoryObj<typeof ValueWithUnit> = {
  render: () => (
    <AtDensity density="dense">
      <ValueWithUnit value="120" unit="mg/dL" tone="warn" />
    </AtDensity>
  ),
}

export const Thai: StoryObj<typeof ValueWithUnit> = {
  parameters: { docs: { description: { story: "Values are locale-neutral; units remain Latin per clinical convention." } } },
  render: () => <ValueWithUnit value={["140", "95"]} unit="mmHg" tone="warn" />,
}
