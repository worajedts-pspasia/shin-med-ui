import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { ReportFrame } from "./ReportFrame"
import { RangeToggle, type RangeId } from "./RangeToggle"
import { SeriesToggle } from "./SeriesToggle"
import {
  fixtureOpsChart,
  fixtureOpsSeries,
  fixtureReportPeriods,
} from "@/fixtures/clinic"

const meta: Meta<typeof ReportFrame> = {
  title: "Medical/Medical Component/Report Frame",
  tags: ["autodocs"],
  component: ReportFrame,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Three report types, one frame: title and Print up top, a period dropdown, the chart canvas as the hero, and a config rail (range, series, calendar) that wraps below the canvas on narrow screens. You bring the chart; the frame brings the chrome.\n\n**Watch out:** the canvas is a slot, not a dependency \u2014 bind your own chart to the same series visibility the config rail edits, or the rail lies.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

function Demo() {
  const [period, setPeriod] = useState("q3")
  const [range, setRange] = useState<RangeId>("all")
  const [visible, setVisible] = useState<string[]>(fixtureOpsSeries.map((s) => s.id))

  const config: ChartConfig = {}
  for (const s of fixtureOpsSeries) config[s.id] = { label: s.label, color: s.color }
  const shown = fixtureOpsSeries.filter((s) => visible.includes(s.id))
  const data = fixtureOpsChart.slice(range === "all" ? 0 : Math.max(0, fixtureOpsChart.length - 3))

  return (
    <div className="max-w-4xl">
      <ReportFrame
        title="Volume & Reliability Report"
        meta="Generated 09/28/2026 · Clinic DS"
        periods={fixtureReportPeriods}
        period={period}
        onPeriod={setPeriod}
        onPrint={() => {}}
        config={
          <>
            <div>
              <p className="mb-1.5 text-xs font-medium text-things-gray-2">Range</p>
              <RangeToggle options={["3m", "all"]} value={range} onChange={setRange} />
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-things-gray-2">Series</p>
              <SeriesToggle series={fixtureOpsSeries} value={visible} onChange={setVisible} />
            </div>
          </>
        }
      >
        {shown.length === 0 ? (
          <p className="flex h-56 items-center justify-center text-sm text-things-gray-3">
            No series selected
          </p>
        ) : (
          <ChartContainer config={config} className="h-56 w-full">
            <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--color-clinic-grid-line)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              {shown.map((s) => (
                <Line
                  key={s.id}
                  dataKey={s.id}
                  type="monotone"
                  stroke={s.color}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ChartContainer>
        )}
      </ReportFrame>
    </div>
  )
}

export const Playground: Story = { render: () => <Demo /> }
