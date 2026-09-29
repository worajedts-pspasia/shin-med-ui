import type { Meta, StoryObj } from "@storybook/react-vite"
import { ComplianceBoard } from "./ComplianceBoard"
import { fixtureCompliance, fixtureComplianceTiers } from "@/fixtures/clinic"
import { Monochrome } from "./story-utils"

const meta: Meta<typeof ComplianceBoard> = {
  title: "Medical/Medical Component/Compliance Board",
  tags: ["autodocs"],
  component: ComplianceBoard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Meaningful Use, or any quality-measure grid: categories down, measures across, each cell a met/partial/unmet chip with its glyph \u2014 \u2713, \u26a0, \u2715 \u2014 so the board survives grayscale and still reads.\n\n**Watch out:** partial is a legitimate state, not a failure to decide. Hide N/A cells' tooltips only if the measure truly doesn't apply.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { tierLabels: fixtureComplianceTiers } as Record<string, unknown>,
  render: () => (
    <div className="max-w-3xl">
      <ComplianceBoard categories={fixtureCompliance} tierLabels={fixtureComplianceTiers} />
    </div>
  ),
}

export const MonochromeStory: Story = {
  name: "Monochrome",
  parameters: { docs: { description: { story: "Glyphs carry the state without colour." } } },
  render: () => (
    <Monochrome>
      <div className="max-w-3xl">
        <ComplianceBoard categories={fixtureCompliance} tierLabels={fixtureComplianceTiers} />
      </div>
    </Monochrome>
  ),
}
