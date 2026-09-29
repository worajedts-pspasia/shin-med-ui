import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { RangeToggle } from "./RangeToggle"
import { AtDensity, ForcedLocale } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof RangeToggle> = {
  title: "Medical/Medical UI/Range Toggle",
  tags: ["autodocs"],
  component: RangeToggle,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("RangeToggle") } },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

function Demo({ options = ["3m", "6m", "1y", "2y", "all"], initial = "1y" }: { options?: string[]; initial?: string }) {
  const [v, setV] = useState<string | undefined>(initial)
  return <RangeToggle options={options} value={v} onChange={setV} />
}

export const Playground: Story = {
  argTypes: { initial: { control: "radio", options: ["3m", "6m", "1y", "2y", "all"] } } as unknown as Meta<typeof RangeToggle>["argTypes"],
  args: { initial: "1y" } as Record<string, unknown>,
  render: (args: any) => <Demo initial={args.initial} />,
}

export const Default: Story = { name: "Default", render: () => <Demo /> }

export const Short: Story = { render: () => <Demo options={["1y", "2y", "all"]} initial="2y" /> }

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <Demo />
      </AtDensity>
    </ForcedLocale>
  ),
}
