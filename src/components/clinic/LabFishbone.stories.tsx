import type { Meta, StoryObj } from "@storybook/react-vite"
import { LabFishbone } from "./LabFishbone"
import { fixtureFishboneCbc, fixtureFishboneChem7 } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof LabFishbone> = {
  title: "Medical/Medical Component/Lab Fishbone",
  tags: ["autodocs"],
  component: LabFishbone,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("LabFishbone"),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Chem7: Story = {
  render: () => (
    <div className="max-w-2xl">
      <LabFishbone panel="chem7" values={fixtureFishboneChem7} />
    </div>
  ),
}

export const Cbc: Story = {
  render: () => (
    <div className="max-w-2xl">
      <LabFishbone panel="cbc" values={fixtureFishboneCbc} />
    </div>
  ),
}
