import type { Meta, StoryObj } from "@storybook/react-vite"
import { MetaGrid } from "./MetaGrid"
import { AtDensity } from "./story-utils"

const meta: Meta<typeof MetaGrid> = {
  title: "Medical/Medical UI/Meta Grid",
  tags: ["autodocs"],
  component: MetaGrid,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Label-over-value pairs in columns \u2014 the single most repeated structure in clinical UI (order detail, specimen info, insurance blocks). Labels gray-xs, values ink-sm, tabular numerals for anything countable. Columns collapse as space disappears; wide items span, then un-span gracefully.\n\n**Watch out:** `span` values only engage where their columns exist \u2014 on a phone everything stacks. Feed values through the formatters (PatientName, dates) rather than raw strings.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  args: {
    items: [
      { label: "Requisition #", value: "2024-088-291", numeric: true },
      { label: "Collected", value: "04/22/2014 07:45" },
      { label: "Reported", value: "04/23/2014 12:02" },
      { label: "Accession", value: "H4325098734", numeric: true },
    ],
    columns: 3,
  },
  argTypes: {
    columns: { control: "radio", options: [1, 2, 3, 4] },
  },
  render: (args: any) => {
    const { items, columns = 3 } = args
    return (
      <div className="w-full max-w-[520px]">
        <MetaGrid items={items} columns={columns} />
      </div>
    )
  },
}
export default meta

export const Playground: StoryObj<typeof MetaGrid> = {}

export const AllStates: StoryObj<typeof MetaGrid> = {
  render: () => (
    <div className="flex w-full max-w-[520px] flex-col gap-6">
      <MetaGrid
        columns={4}
        items={[
          { label: "Patient", value: "Smith, Michael A." },
          { label: "DOB", value: "03/15/1980", numeric: true },
          { label: "MRN", value: "000001", numeric: true },
          { label: "Sex", value: "Male" },
          { label: "Address", value: "1180 Duanesburg Rd, Schenectady, NY 12306", span: 2 },
          { label: "Phone", value: "(317) 555-0117", numeric: true },
        ]}
      />
      <MetaGrid
        columns={2}
        items={[
          { label: "Drug", value: "Lipitor (atorvastatin)" },
          { label: "Strength", value: "40 mg", numeric: true },
          { label: "Sig", value: "1 tablet by mouth daily", span: 2 },
        ]}
      />
    </div>
  ),
}
