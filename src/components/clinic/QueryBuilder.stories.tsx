import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { QueryBuilder, type QueryRule } from "./QueryBuilder"
import {
  fixtureQueryActions,
  fixtureQueryFields,
  fixtureQueryResults,
  fixtureQueryRulesSeed,
} from "@/fixtures/clinic"
import type { DataTableColumn } from "./DataTable"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof QueryBuilder> = {
  title: "Medical/Medical Component/Query Builder",
  tags: ["autodocs"],
  component: QueryBuilder,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("QueryBuilder"),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

const COLUMNS: Array<DataTableColumn<Record<string, string>>> = [
  { id: "name", header: "Patient", cell: (r) => <span className="font-medium text-things-title">{r.name}</span> },
  { id: "mrn", header: "MRN", width: 90, numeric: true, cell: (r) => r.mrn },
  { id: "age", header: "Age", width: 60, numeric: true, cell: (r) => r.age },
  { id: "lastVisit", header: "Last visit", width: 110, numeric: true, cell: (r) => r.lastVisit },
  { id: "pcp", header: "Primary care", width: 130, priority: "secondary", cell: (r) => r.pcp },
]

function Demo() {
  const [rules, setRules] = useState<QueryRule[]>(fixtureQueryRulesSeed)
  const [ran, setRan] = useState(false)
  return (
    <div className="max-w-3xl">
      <QueryBuilder
        fields={fixtureQueryFields}
        rules={rules}
        onRules={setRules}
        onRun={() => setRan(true)}
        resultColumns={COLUMNS}
        resultRows={ran ? fixtureQueryResults : []}
        rowKey={(r) => r.id}
        actions={fixtureQueryActions}
        onAction={(a, selected) => console.info(a, selected)}
      />
    </div>
  )
}

export const Playground: Story = { render: () => <Demo /> }
