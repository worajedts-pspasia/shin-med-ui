import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { MedicationTimeline } from "./MedicationTimeline"
import { AtDensity, ForcedLocale } from "./story-utils"
import { bpTrendSeries, fixtureMeds } from "@/fixtures/clinic"

const meta: Meta<typeof MedicationTimeline> = {
  title: "Medical/Medical Component/Medication Timeline",
  tags: ["autodocs"],
  component: MedicationTimeline,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Therapy as a Gantt: one bar per drug from first fill to last, gaps visible at a glance, clamped eras flat-edged so \"we don't know when this ended\" is legible. Day/Week/Month zoom tightens the window instead of shrinking bars into noise.\n\n**Watch out:** the window is bounded (a 2019 aspirin will not stretch the axis to 75,000 pixels \u2014 that bug is dead, but it taught us). Bars are category-colored; status rides as glyph.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

const TODAY = "2026-09-28T12:00"

function Demo({ show = "all", withToggle = true }: { show?: "current" | "all"; withToggle?: boolean }) {
  const [s, setS] = useState(show)
  return (
    <MedicationTimeline
      meds={fixtureMeds}
      show={s}
      onShowChange={withToggle ? setS : undefined}
      today={TODAY}
      maxHeight={220}
    />
  )
}

export const Playground: Story = {
  argTypes: { show: { control: "radio", options: ["current", "all"] } },
  args: { show: "all" } as Record<string, unknown>,
  render: (args: any) => <Demo show={args.show} />,
}

export const Default: Story = { name: "Default", render: () => <Demo /> }

/** The wave-4 pairing: med spans under the BP trend, shared x-axis window. */
export const WithTrendChart: Story = {
  render: () => {
    const first = bpTrendSeries[0].points[0].at
    const last = bpTrendSeries[0].points[bpTrendSeries[0].points.length - 1].at
    return (
      <div className="flex max-w-2xl flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-things-gray-3">BP trend</p>
        <p className="-mt-2 text-[11px] text-things-gray-3">(chart above — see TrendChart story; same window passed below)</p>
        <MedicationTimeline meds={fixtureMeds} range={[first, last]} pxPerDay={6} today={TODAY} maxHeight={200} />
      </div>
    )
  },
}

export const Narrow: Story = {
  render: () => (
    <AtDensity density="compact">
      <div className="max-w-[390px]">
        <Demo withToggle={false} />
      </div>
    </AtDensity>
  ),
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <MedicationTimeline
          meds={[
            { id: "t1", label: "ลิซิโนพริล 30 มก.", start: "2025-03-15", status: "active", dose: "1-0-0" },
            { id: "t2", label: "เมตฟอร์มิน 1,000 มก.", start: "2024-06-10", end: "2026-04-02", status: "stopped", dose: "1-0-1" },
            { id: "t3", label: "แอมโลดิพีน 5 มก.", start: "2026-08-12", status: "held", dose: "วันละครั้ง" },
          ]}
          today={TODAY}
          maxHeight={180}
        />
      </AtDensity>
    </ForcedLocale>
  ),
}
