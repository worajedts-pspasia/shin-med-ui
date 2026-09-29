import type { Meta, StoryObj } from "@storybook/react-vite"
import { ResultTable } from "./ResultTable"
import { AtDensity, ForcedLocale, Monochrome } from "./story-utils"
import { fixturePanels } from "@/fixtures/clinic"

const meta: Meta<typeof ResultTable> = {
  title: "Medical/Medical Component/Result Table",
  tags: ["autodocs"],
  component: ResultTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Lab results with their context: value + unit + range, flags with their letters, interpretive notes as sub-rows, grouped by panel \u2014 the table a physician scans before calling the patient. Sticky header and first column; abnormal rows tint without shouting.\n\n**Watch out:** the flag channel is severity (letters + tone). Never color a row for \"new\" or \"acknowledged\" \u2014 those are workflow states with their own marks.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  argTypes: { dense: { control: "boolean" } },
  args: { dense: false } as Record<string, unknown>,
  render: (args: any) => <ResultTable panels={fixturePanels} dense={args.dense} maxHeight={360} />,
}

export const Default: Story = {
  name: "Default",
  render: () => <ResultTable panels={fixturePanels} maxHeight={360} />,
}

export const Dense: Story = {
  render: () => <ResultTable panels={fixturePanels} dense maxHeight={320} />,
}

export const MonochromeStory: Story = {
  name: "Monochrome",
  parameters: { docs: { description: { story: "Flags carry a letter + glyph channel — readable without colour." } } },
  render: () => (
    <Monochrome>
      <ResultTable panels={fixturePanels} maxHeight={360} />
    </Monochrome>
  ),
}

export const Narrow: Story = {
  render: () => (
    <AtDensity density="compact">
      <div className="max-w-[390px]">
        <ResultTable panels={fixturePanels} maxHeight={280} />
      </div>
    </AtDensity>
  ),
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <ResultTable panels={fixturePanels} maxHeight={360} />
      </AtDensity>
    </ForcedLocale>
  ),
}
