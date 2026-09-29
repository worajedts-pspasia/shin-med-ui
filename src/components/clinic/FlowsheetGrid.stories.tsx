import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { FlowsheetGrid } from "./FlowsheetGrid"
import { AtDensity, ForcedLocale } from "./story-utils"
import { flowColumns, flowSections, flowValues } from "@/fixtures/clinic"

const meta: Meta<typeof FlowsheetGrid> = {
  title: "Medical/Medical Component/Flowsheet Grid",
  tags: ["autodocs"],
  component: FlowsheetGrid,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Measures down, encounters across \u2014 the flowsheet that shows a patient's trajectory at a glance: BP, weight, A1c column by column. Sticky header row *and* first column, because both axes matter equally, and abnormal cells carry their tone.\n\n**Watch out:** wide time spans scroll horizontally by design. Column headers must stay encounter-dated or the \"trajectory\" story breaks.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

function Demo({ onlyRowsWithData = false, maxColumns = 7 }: { onlyRowsWithData?: boolean; maxColumns?: number }) {
  return (
    <FlowsheetGrid
      sections={flowSections}
      columns={flowColumns}
      values={flowValues}
      onlyRowsWithData={onlyRowsWithData}
      maxColumns={maxColumns}
      maxHeight={280}
      onCellSelect={(r, c) => console.log("cell", r, c)}
      onPlot={(rows) => console.log("plot", rows)}
    />
  )
}

export const Playground: Story = {
  argTypes: {
    onlyRowsWithData: { control: "boolean" },
    maxColumns: { control: "radio", options: [4, 7] },
  } as unknown as Meta<typeof FlowsheetGrid>["argTypes"],
  args: { onlyRowsWithData: false, maxColumns: 7 } as Record<string, unknown>,
  render: (args: any) => <Demo onlyRowsWithData={args.onlyRowsWithData} maxColumns={args.maxColumns} />,
}

export const Default: Story = { name: "Default", render: () => <Demo /> }

export const OnlyRowsWithData: Story = { render: () => <Demo onlyRowsWithData /> }

export const Dense: Story = {
  decorators: [(Story) => <AtDensity density="dense"><Story /></AtDensity>],
  render: () => <Demo />,
}

/** Scroll-locked proof (06 §1): sticky measure column + sticky header at 390px. */
export const Narrow: Story = {
  render: () => (
    <AtDensity density="compact">
      <div className="max-w-[390px]">
        <Demo maxColumns={4} />
      </div>
    </AtDensity>
  ),
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <Demo />
      </AtDensity>
    </ForcedLocale>
  ),
}
