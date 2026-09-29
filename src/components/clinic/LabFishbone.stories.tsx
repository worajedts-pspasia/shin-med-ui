import type { Meta, StoryObj } from "@storybook/react-vite"
import { LabFishbone } from "./LabFishbone"
import { fixtureFishboneCbc, fixtureFishboneChem7 } from "@/fixtures/clinic"

const meta: Meta<typeof LabFishbone> = {
  title: "Medical/Medical Component/Lab Fishbone",
  tags: ["autodocs"],
  component: LabFishbone,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The CHEM-7 and CBC skeleton diagram clinicians draw on napkins \u2014 spine, bones, values at the tips, flagged values in amber or red ink. Beloved, fast to read, and meaningless to anyone who never drew one.\n\n**Watch out:** it's an *alternate* view of the panel, never the only one \u2014 ResultTable is the accessible, sortable, copyable default. Desktop-only; below lg it says so.",
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
