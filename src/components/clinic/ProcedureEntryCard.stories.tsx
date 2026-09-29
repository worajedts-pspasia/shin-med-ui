import type { Meta, StoryObj } from "@storybook/react-vite"
import { NestedPanel } from "./NestedPanel"
import { ProcedureEntryCard } from "./ProcedureEntryCard"
import { AtDensity, ForcedLocale } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof ProcedureEntryCard> = {
  title: "Medical/Medical Component/Procedure Entry Card",
  tags: ["autodocs"],
  component: ProcedureEntryCard,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("ProcedureEntryCard"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
}
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  argTypes: { open: { control: "boolean" }, withToggle: { control: "boolean" } } as unknown as Meta<typeof ProcedureEntryCard>["argTypes"],
  args: { open: true, withToggle: true } as Record<string, unknown>,
  render: (args: any) => (
    <div className="max-w-lg space-y-3">
      <ProcedureEntryCard
        kind="Angiogram" title="LAD — 2026-08-14" accent="var(--color-things-teal)" defaultOpen={args.open}
        toggle={args.withToggle ? { checked: true, onChange: () => {}, label: "Performed" } : undefined}
        meta={[{ label: "Access", value: "Radial R" }, { label: "Pre", value: "90%", numeric: true }, { label: "Post", value: "0%", numeric: true }, { label: "TIMI", value: "2 → 3", numeric: true }]}
        onEdit={() => {}}
      >
        <NestedPanel title="Findings" onAdd={() => {}}>
          <p className="text-sm text-things-title">LAD 90% pre · 0% post, TIMI 3</p>
        </NestedPanel>
      </ProcedureEntryCard>
      <ProcedureEntryCard kind="Subjective" title="PI — epigastric burning × 3 days" accent="var(--color-things-glyph-blue)" defaultOpen={false} />
    </div>
  ),
}
export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <div className="max-w-lg">
          <ProcedureEntryCard
            kind="การซักประวัติ" title="PI — แสบท้องแน่น 3 วัน" accent="var(--color-things-glyph-blue)"
            meta={[{ label: "ระยะเวลา", value: "3 วัน" }, { label: "ความรุนแรง", value: "ปานกลาง" }]}
          />
        </div>
      </AtDensity>
    </ForcedLocale>
  ),
}
