import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { OrderEntryForm, type OrderDraft } from "./OrderEntryForm"
import { AtDensity, ForcedLocale } from "./story-utils"
import { codedDrugs, codedIcd10, fixtureOrderSets } from "@/fixtures/clinic"
import type { CodedConcept } from "./types"
import { docsDesc } from "@/lib/docs-desc"

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const searchIcd = async (q: string): Promise<CodedConcept[]> => {
  await sleep(200)
  const n = q.toLowerCase()
  return codedIcd10.filter((c) => c.code.toLowerCase().includes(n) || c.term.toLowerCase().includes(n))
}
const searchDrugs = async (q: string): Promise<CodedConcept[]> => {
  await sleep(200)
  const n = q.toLowerCase()
  return codedDrugs.filter((c) => c.term.toLowerCase().includes(n) || (c.localTerm ?? "").includes(q))
}

const meta: Meta<typeof OrderEntryForm> = {
  title: "Medical/Medical Component/Order Entry Form",
  tags: ["autodocs"],
  component: OrderEntryForm,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("OrderEntryForm"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

function LabDemo({ showCost = false }: { showCost?: boolean }) {
  const [order, setOrder] = useState<OrderDraft>({ concept: codedIcd10[0], normalMin: "0", normalMax: "35", criticalValue: "150" })
  return (
    <div className="max-w-2xl rounded-md border border-things-hairline bg-card p-3">
      <OrderEntryForm
        kind="lab" value={order} onChange={setOrder} onSave={() => {}} onDelete={() => {}}
        search={searchIcd} orderSets={fixtureOrderSets} onApplySet={() => {}} onSaveSet={() => {}}
        showCost={showCost} relatedProblems={["T2DM (E11.9)", "CKD stage 3 (N18.3)"]}
      />
    </div>
  )
}

function DrugDemo() {
  const [order, setOrder] = useState<OrderDraft>({ concept: codedDrugs[1], qty: "30", days: "30", sig: "1 tab morning and evening" })
  return (
    <div className="max-w-2xl rounded-md border border-things-hairline bg-card p-3">
      <OrderEntryForm kind="drug" value={order} onChange={setOrder} onSave={() => {}} onDelete={() => {}} search={searchDrugs} orderSets={fixtureOrderSets} onApplySet={() => {}} />
    </div>
  )
}

export const Playground: Story = {
  argTypes: { kind: { control: "radio", options: ["drug", "lab"] }, showCost: { control: "boolean" } } as unknown as Meta<typeof OrderEntryForm>["argTypes"],
  args: { kind: "lab", showCost: false } as Record<string, unknown>,
  render: (args: any) => (args.kind === "drug" ? <DrugDemo /> : <LabDemo showCost={args.showCost} />),
}
export const DrugMode: Story = { render: () => <DrugDemo /> }
export const LabMode: Story = { name: "Lab mode (critical value)", render: () => <LabDemo /> }
export const Thai: Story = { render: () => <ForcedLocale locale="th"><AtDensity density="compact"><LabDemo showCost /></AtDensity></ForcedLocale> }
