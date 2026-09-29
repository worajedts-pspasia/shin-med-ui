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

const meta: Meta<typeof QueryBuilder> = {
  title: "Medical/Medical Component/Query Builder",
  tags: ["autodocs"],
  component: QueryBuilder,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The reporting rule editor: field / operator / value rows (drag the grip or use the up/down buttons to reorder), OR'd criteria chips showing the plain-language query, Run, then results with bulk actions. Built for the administrator who asks \"give me all diabetics over 60 due for A1c\".\n\n**Watch out:** the chips are the query's *contract* \u2014 they must read exactly what will run. Editor is desktop-only; results render anywhere.",
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
