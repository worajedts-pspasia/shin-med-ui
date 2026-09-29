import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { RangeToggle } from "./RangeToggle"
import { AtDensity, ForcedLocale } from "./story-utils"

const meta: Meta<typeof RangeToggle> = {
  title: "Medical/Medical UI/Range Toggle",
  tags: ["autodocs"],
  component: RangeToggle,
  parameters: {
    layout: "padded",
    docs: { description: { component: "3m \u00b7 6m \u00b7 1y \u00b7 2y \u00b7 All \u2014 the period switcher that trend charts and flowsheets share. Deliberately trivial: it holds no state, it just speaks the choice.\n\n**Watch out:** pass the options you actually support \u2014 hiding \"2y\" is better than offering it and rendering an empty chart." } },
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
