import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { CodedSearchInput } from "./CodedSearchInput"
import { AtDensity, ForcedLocale } from "./story-utils"
import { codedDrugs, codedIcd10 } from "@/fixtures/clinic"
import type { CodedConcept } from "./types"
import { docsDesc } from "@/lib/docs-desc"

/** Deterministic fake async — resolves after a fixed delay, no randomness. */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function searchIcd10(q: string): Promise<CodedConcept[]> {
  await sleep(250)
  const needle = q.toLowerCase()
  return codedIcd10.filter(
    (c) => c.code.toLowerCase().includes(needle) || c.term.toLowerCase().includes(needle) || (c.localTerm ?? "").includes(q),
  )
}

async function searchDrugs(q: string): Promise<CodedConcept[]> {
  await sleep(250)
  const needle = q.toLowerCase()
  return codedDrugs.filter((c) => c.term.toLowerCase().includes(needle) || (c.localTerm ?? "").includes(q))
}

const meta: Meta<typeof CodedSearchInput<CodedConcept>> = {
  title: "Medical/Medical UI/Coded Search Input",
  tags: ["autodocs"],
  component: CodedSearchInput,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("CodedSearchInput"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  argTypes: {
    system: { control: "select", options: ["icd10", "snomed", "drug", "lab", "cpt", "icd9"] },
    allowFreeText: { control: "boolean" },
    withPicks: { control: "boolean" },
  } as unknown as Meta<typeof CodedSearchInput<CodedConcept>>["argTypes"],
  args: { system: "icd10", allowFreeText: false, withPicks: true } as Record<string, unknown>,
}
export default meta

type Story = StoryObj<typeof meta>

function Icd10Demo({ allowFreeText, withPicks }: { allowFreeText: boolean; withPicks: boolean }) {
  const [value, setValue] = useState<CodedConcept | undefined>(codedIcd10[0])
  return (
    <div className="max-w-md">
      <CodedSearchInput<CodedConcept>
        system="icd10"
        value={value}
        onSelect={setValue}
        search={searchIcd10}
        allowFreeText={allowFreeText}
        favorites={withPicks ? [codedIcd10[0], codedIcd10[4]] : undefined}
        recents={withPicks ? [codedIcd10[3]] : undefined}
        onClear={() => setValue(undefined)}
      />
    </div>
  )
}

export const Playground: Story = {
  render: (args: any) => (
    <Icd10Demo allowFreeText={args.allowFreeText ?? false} withPicks={args.withPicks ?? true} />
  ),
}

export const Default: Story = { name: "Default", render: () => <Icd10Demo allowFreeText={false} withPicks /> }

export const Empty: Story = {
  render: () => {
    const [, setValue] = useState<CodedConcept | undefined>()
    return (
      <div className="max-w-md">
        <CodedSearchInput<CodedConcept> system="icd10" onSelect={(c) => setValue(c)} search={searchIcd10} />
      </div>
    )
  },
}

export const DrugSearch: Story = {
  render: () => {
    const [value, setValue] = useState<CodedConcept | undefined>()
    return (
      <div className="max-w-md">
        <CodedSearchInput<CodedConcept>
          system="drug"
          value={value}
          onSelect={setValue}
          search={searchDrugs}
          favorites={[codedDrugs[1]]}
        />
      </div>
    )
  },
}

export const FreeTextAllowed: Story = {
  render: () => <Icd10Demo allowFreeText withPicks />,
}

export const Disabled: Story = {
  render: () => (
    <div className="max-w-md">
      <CodedSearchInput<CodedConcept>
        system="snomed"
        value={codedIcd10[1]}
        onSelect={() => {}}
        search={searchIcd10}
        disabled
      />
    </div>
  ),
}

export const Dense: Story = {
  decorators: [(Story) => <AtDensity density="dense"><Story /></AtDensity>],
  render: () => <Icd10Demo allowFreeText={false} withPicks />,
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <div className="max-w-md">
          <CodedSearchInput<CodedConcept>
            system="icd10"
            value={codedIcd10[4]}
            onSelect={() => {}}
            search={searchIcd10}
            favorites={[codedIcd10[0], codedIcd10[4]]}
            recents={[codedIcd10[1]]}
          />
        </div>
      </AtDensity>
    </ForcedLocale>
  ),
}
