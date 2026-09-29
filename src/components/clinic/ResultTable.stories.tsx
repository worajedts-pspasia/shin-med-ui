import type { Meta, StoryObj } from "@storybook/react-vite"
import { ResultTable } from "./ResultTable"
import { AtDensity, ForcedLocale, Monochrome } from "./story-utils"
import { fixturePanels } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof ResultTable> = {
  title: "Medical/Medical Component/Result Table",
  tags: ["autodocs"],
  component: ResultTable,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("ResultTable"),
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
  parameters: { docs: { description: { story: docsDesc("ResultTable::MonochromeStory") } } },
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
