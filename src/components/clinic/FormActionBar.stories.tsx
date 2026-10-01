import type { Meta, StoryObj } from "@storybook/react-vite"
import { FormActionBar } from "./FormActionBar"
import { AtDensity, ForcedLocale } from "./story-utils"
import { docsDesc } from "@/lib/docs-desc"

const meta: Meta<typeof FormActionBar> = {
  title: "Medical/Medical UI/Form Action Bar",
  tags: ["autodocs"],
  component: FormActionBar,
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("FormActionBar"),
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  argTypes: {
    dirty: { control: "boolean" },
    saving: { control: "boolean" },
    disabledPrimary: { control: "boolean" },
    hasDestructive: { control: "boolean" },
  } as unknown as Meta<typeof FormActionBar>["argTypes"],
  args: { dirty: true, saving: false, disabledPrimary: false, hasDestructive: true } as Record<string, unknown>,
}
export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args: any) => (
    <FormActionBar
      primary={{
        label: "Save",
        onSelect: () => {},
        disabled: args.disabledPrimary,
        reason: args.disabledPrimary ? "Required fields are missing." : undefined,
      }}
      secondary={[{ label: "Cancel", onSelect: () => {} }]}
      destructive={args.hasDestructive ? { label: "Delete", confirmLabel: "Delete this registration?", onConfirm: () => {} } : undefined}
      dirty={args.dirty}
      saving={args.saving}
      onCancel={() => {}}
    />
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-5">
      <div className="rounded-md border border-things-hairline">
        <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-things-gray-3">Clean</p>
        <FormActionBar primary={{ label: "Save", onSelect: () => {} }} secondary={[{ label: "Cancel", onSelect: () => {} }]} onCancel={() => {}} />
      </div>
      <div className="rounded-md border border-things-hairline">
        <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-things-gray-3">Dirty (unsaved marker)</p>
        <FormActionBar primary={{ label: "Save", onSelect: () => {} }} secondary={[{ label: "Cancel", onSelect: () => {} }]} dirty onCancel={() => {}} />
      </div>
      <div className="rounded-md border border-things-hairline">
        <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-things-gray-3">Saving</p>
        <FormActionBar primary={{ label: "Save", onSelect: () => {} }} saving dirty />
      </div>
      <div className="rounded-md border border-things-hairline">
        <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-things-gray-3">Disabled primary with reason (tooltip)</p>
        <FormActionBar primary={{ label: "Send to lab", onSelect: () => {}, disabled: true, reason: "No specimens added yet." }} />
      </div>
      <div className="rounded-md border border-things-hairline">
        <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-things-gray-3">Destructive segregated behind confirm</p>
        <FormActionBar
          primary={{ label: "Save", onSelect: () => {} }}
          destructive={{ label: "Inactivate", confirmLabel: "Inactivate this problem? It stays reversible.", onConfirm: () => {} }}
          onCancel={() => {}}
        />
      </div>
    </div>
  ),
}

export const Default: Story = {
  name: "Default",
  render: () => <FormActionBar primary={{ label: "Save", onSelect: () => {} }} secondary={[{ label: "Cancel", onSelect: () => {} }]} dirty onCancel={() => {}} />,
}

/** The bar sticks while the form above scrolls. */
export const StickyBottom: Story = {
  parameters: { layout: "centered" },
  render: () => (
    <div className="flex h-[320px] w-full max-w-xl flex-col overflow-y-auto rounded-md border border-things-hairline">
      <div className="flex flex-1 flex-col gap-4 p-4">
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i} className="text-sm text-things-gray-2">Scrollable form content — line {i + 1}</p>
        ))}
      </div>
      <FormActionBar primary={{ label: "Save", onSelect: () => {} }} secondary={[{ label: "Cancel", onSelect: () => {} }]} dirty onCancel={() => {}} />
    </div>
  ),
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="compact">
        <div className="max-w-xl rounded-md border border-things-hairline">
          <FormActionBar
            primary={{ label: "บันทึก", onSelect: () => {} }}
            secondary={[{ label: "ยกเลิก", onSelect: () => {} }, { label: "ส่งตรวจ", onSelect: () => {} }]}
            destructive={{ label: "ลบ", confirmLabel: "ลบทะเบียนนี้?", onConfirm: () => {} }}
            dirty
            onCancel={() => {}}
          />
        </div>
      </AtDensity>
    </ForcedLocale>
  ),
}

export const Japanese: Story = {
  render: () => (
    <ForcedLocale locale="ja">
      <AtDensity density="compact">
        <div className="max-w-xl rounded-md border border-things-hairline">
          <FormActionBar
            primary={{ label: "บันทึก", onSelect: () => {} }}
            secondary={[{ label: "ยกเลิก", onSelect: () => {} }, { label: "ส่งตรวจ", onSelect: () => {} }]}
            destructive={{ label: "ลบ", confirmLabel: "ลบทะเบียนนี้?", onConfirm: () => {} }}
            dirty
            onCancel={() => {}}
          />
        </div>
      </AtDensity>
    </ForcedLocale>
  ),
}