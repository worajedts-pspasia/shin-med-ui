import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { PatientSearchCombobox } from "./PatientSearchCombobox"
import { ForcedLocale } from "./story-utils"
import { patientCorpus } from "@/fixtures/clinic"
import type { PatientIdentity } from "./types"

const meta: Meta<typeof PatientSearchCombobox> = {
  title: "Medical/Medical UI/Patient Search Combobox",
  tags: ["autodocs"],
  component: PatientSearchCombobox,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Find a patient by name or MRN in one box \u2014 results show name, DOB and MRN together, because two \"\u0e2a\u0e21\u0e0a\u0e32\u0e22 \u0e17\u0e14\u0e2a\u0e2d\u0e1a\" exist and only the numbers disambiguate. Enter selects an exact match; arrow keys walk the list.\n\n**Watch out:** duplicate names are the normal case, not the edge case. If your result rows ever drop the MRN, this component has failed at its one job.",
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const makeSearch = (all: PatientIdentity[]) => async (q: string) => {
  await sleep(200)
  const n = q.trim().toLowerCase()
  return all.filter(
    (p) =>
      p.mrn.includes(n) ||
      `${p.name.given} ${p.name.family}`.toLowerCase().includes(n) ||
      (p.name.title ? `${p.name.title}${p.name.given} ${p.name.family}` : `${p.name.given} ${p.name.family}`).includes(q),
  )
}
const searchAll = makeSearch(patientCorpus)
const searchToday = makeSearch(patientCorpus.slice(0, 3))

function Demo({ scope = "all" }: { scope?: "all" | "today" | "mine" }) {
  const [picked, setPicked] = useState<PatientIdentity | undefined>()
  return (
    <div className="max-w-md">
      <PatientSearchCombobox onSelect={setPicked} search={scope === "all" ? searchAll : searchToday} scope={scope} />
      {picked && <p className="mt-2 text-xs text-things-gray-3">Selected: MRN {picked.mrn}</p>}
    </div>
  )
}

export const Playground: Story = {
  argTypes: { scope: { control: "radio", options: ["all", "today", "mine"] } },
  args: { scope: "all" } as Record<string, unknown>,
  render: (args: any) => <Demo scope={args.scope} />,
}
export const Default: Story = { name: "Default", render: () => <Demo /> }
export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <Demo />
    </ForcedLocale>
  ),
}
