import type { Meta, StoryObj } from "@storybook/react-vite"
import { ComplianceBoard } from "./ComplianceBoard"
import { fixtureCompliance, fixtureComplianceTiers } from "@/fixtures/clinic"
import { Monochrome } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof ComplianceBoard> = {
  title: "Medical/Medical Component/Compliance Board",
  tags: ["autodocs"],
  component: ComplianceBoard,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("ComplianceBoard"),
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
  parameters: { docs: { description: { story: docsDesc("ComplianceBoard::MonochromeStory") } } },
  render: () => (
    <Monochrome>
      <div className="max-w-3xl">
        <ComplianceBoard categories={fixtureCompliance} tierLabels={fixtureComplianceTiers} />
      </div>
    </Monochrome>
  ),
}
