import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { TrendChart } from "./TrendChart"
import { RangeToggle } from "./RangeToggle"
import { AtDensity, ForcedLocale } from "./story-utils"
import { bpAnnotations, bpTrendSeries } from "@/fixtures/clinic"

const meta: Meta<typeof TrendChart> = {
  title: "Medical/Medical Component/Trend Chart",
  tags: ["autodocs"],
  component: TrendChart,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Multi-series clinical time series with the works: reference bands for normal ranges, annotations for dose changes, a range toggle, and points that never overlap their labels. Systolic and diastolic get their own colors because clinicians read them as a pair.\n\n**Watch out:** the y-domain pads from the data and the bands \u2014 a trend that starts at zero flattens every clinical signal into noise. Let the axis lie only when you can defend it.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

const BP_BANDS = [
  { from: 90, to: 120, tone: "ok" as const }, // systolic normal
  { from: 60, to: 80, tone: "ok" as const }, // diastolic normal
]

function Demo({ withBands = true, withAnnotations = true }: { withBands?: boolean; withAnnotations?: boolean }) {
  const [range, setRange] = useState<string>("all")
  return (
    <div className="flex max-w-2xl flex-col gap-2">
      <TrendChart
        series={bpTrendSeries}
        range={range}
        onRangeChange={setRange}
        referenceBands={withBands ? BP_BANDS : undefined}
        annotations={withAnnotations ? bpAnnotations : undefined}
        unit="mmHg"
      />
      <RangeToggle options={["3m", "6m", "1y", "2y", "all"]} value={range} onChange={setRange} />
    </div>
  )
}

export const Playground: Story = {
  argTypes: {
    withBands: { control: "boolean" },
    withAnnotations: { control: "boolean" },
  } as unknown as Meta<typeof TrendChart>["argTypes"],
  args: { withBands: true, withAnnotations: true } as Record<string, unknown>,
  render: (args: any) => <Demo withBands={args.withBands} withAnnotations={args.withAnnotations} />,
}

export const Default: Story = { name: "Default", render: () => <Demo /> }

export const NoBands: Story = {
  parameters: { docs: { description: { story: "Without reference bands the chart is decorative — compare with Default." } } },
  render: () => <Demo withBands={false} withAnnotations={false} />,
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <Demo />
      </AtDensity>
    </ForcedLocale>
  ),
}
