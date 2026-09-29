import type { Meta, StoryObj } from "@storybook/react-vite"
import { KpiScorecard } from "./KpiScorecard"
import { fixtureKpiMetrics, fixtureKpiRows } from "@/fixtures/clinic"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof KpiScorecard> = {
  title: "Medical/Medical Component/Kpi Scorecard",
  tags: ["autodocs"],
  component: KpiScorecard,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("KpiScorecard"),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { title: "Site scorecard — 09/28" } as Record<string, unknown>,
  render: () => (
    <div className="max-w-xl">
      <KpiScorecard title="Site scorecard — 09/28" metrics={fixtureKpiMetrics} rows={fixtureKpiRows} />
    </div>
  ),
}
