import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { MiniCalendar } from "./MiniCalendar"
import { AtDensity, ForcedLocale } from "./story-utils"
import { calMarkers } from "@/fixtures/clinic"

const meta: Meta<typeof MiniCalendar> = {
  title: "Medical/Medical UI/Mini Calendar",
  tags: ["autodocs"],
  component: MiniCalendar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The month grid that earns its place in a sidebar: today wears the clinic-today highlight, and days with appointments carry density dots so the calendar forecasts the workload, not just the date. Controlled selection, month navigation, locale-correct.\n\n**Watch out:** `markers` is what makes this useful \u2014 a MiniCalendar without markers is just a date picker wearing a lab coat.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta

type Story = StoryObj<typeof meta>

function Demo({ markers = true, selected = "2026-09-24" }: { markers?: boolean; selected?: string }) {
  const [sel, setSel] = useState(selected)
  return <MiniCalendar month="2026-09" selected={sel} onSelect={setSel} markers={markers ? calMarkers : undefined} />
}

export const Playground: Story = {
  argTypes: {
    markers: { control: "boolean" },
  },
  args: { markers: true } as Record<string, unknown>,
  render: (args: any) => <Demo markers={args.markers} />,
}

export const Default: Story = { name: "Default", render: () => <Demo /> }

export const NoMarkers: Story = { render: () => <Demo markers={false} /> }

export const Dense: Story = {
  decorators: [(Story) => <AtDensity density="dense"><Story /></AtDensity>],
  render: () => <Demo />,
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

export const Japanese: Story = {
  render: () => (
    <ForcedLocale locale="ja">
      <AtDensity density="compact">
        <Demo />
      </AtDensity>
    </ForcedLocale>
  ),
}
