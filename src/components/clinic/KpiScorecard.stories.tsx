import type { Meta, StoryObj } from "@storybook/react-vite"
import { KpiScorecard } from "./KpiScorecard"
import { fixtureKpiMetrics, fixtureKpiRows } from "@/fixtures/clinic"

const meta: Meta<typeof KpiScorecard> = {
  title: "Medical/Medical Component/Kpi Scorecard",
  tags: ["autodocs"],
  component: KpiScorecard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The site scorecard from the operations family: two or three MetricTiles up top for the glance numbers, then cumulative label\u2192value rows with semantic tones for the detail. One card, one shift's story.\n\n**Watch out:** rows are totals, not trends \u2014 if the reader needs direction, that's MetricTile's sparkline, not this table.",
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
