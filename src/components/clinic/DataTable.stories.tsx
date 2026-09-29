import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useTranslation } from "react-i18next"
import { DataTable, type DataTableColumn } from "./DataTable"
import { StatusDot } from "./StatusDot"
import { AtDensity, ForcedLocale } from "./story-utils"
import { fixtureVisits, type VisitRow } from "@/fixtures/clinic"

/** Month label via Intl so the group row localizes with the story locale. */
function monthLabel(iso: string, locale: string) {
  const d = new Date(`${iso.slice(0, 7)}-01T00:00:00Z`)
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(d)
}

function dayLabel(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`))
}

function visitColumns(locale: string, args?: { narrow?: boolean }): DataTableColumn<VisitRow>[] {
  const base: DataTableColumn<VisitRow>[] = [
    {
      id: "date", header: "Date", width: 96, sticky: "start",
      cell: (r) => <span className="clinic-num">{dayLabel(r.date, locale)}</span>,
    },
    { id: "time", header: "Time", width: 64, numeric: true, priority: args?.narrow ? "primary" : "secondary", cell: (r) => r.time },
    { id: "type", header: "Type", width: 120, cell: (r) => <TypeCell row={r} /> },
    { id: "provider", header: "Provider", width: 160, priority: args?.narrow ? "primary" : "secondary", cell: (r) => r.provider },
    { id: "wait", header: "Wait (min)", width: 84, numeric: true, cell: (r) => r.waitMinutes },
    { id: "copay", header: "Copay (THB)", width: 100, numeric: true, priority: "secondary", cell: (r) => r.copay },
    { id: "status", header: "Status", width: 120, cell: (r) => <StatusDot tone={r.status} size="sm" /> },
  ]
  return base
}

function TypeCell({ row }: { row: VisitRow }) {
  const { i18n } = useTranslation()
  return <>{i18n.language === "th" ? row.typeTh : row.type}</>
}

const meta: Meta<typeof DataTable> = {
  title: "Medical/Medical UI/Data Table",
  tags: ["autodocs"],
  component: DataTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The dense table everything else is built on \u2014 sticky header, optional sticky first column, zebra, group rows, per-row severity tints, numeric columns in tabular figures, sub-rows for interpretive notes, and windowed rendering past 200 rows. Eleven organisms compose this instead of reskinning tables.\n\n**Watch out:** wrap it in a `min-w-0` flex/grid child or the table refuses to shrink (the classic CSS grid trap), and set an ancestor `data-density` \u2014 row heights are token-driven, not hardcoded.",
      },
    },
  },
  decorators: [(Story) => <AtDensity density="compact"><Story /></AtDensity>],
  argTypes: {
    zebra: { control: "boolean" },
    maxHeight: { control: "number" },
  },
  args: { zebra: true, maxHeight: 240 },
}
export default meta

type Story = StoryObj<typeof meta>

/** Default: grouped, zebra'd, sortable, selectable, with one sub-row note. */
function GroupedDemo({ zebra, maxHeight, sortable, selectable }: { zebra: boolean; maxHeight: number; sortable: boolean; selectable: boolean }) {
  const [sort, setSort] = useState<{ id: string; dir: "asc" | "desc" } | undefined>()
  const [selected, setSelected] = useState<string[]>([])
  const { t, i18n } = useTranslation()
  return (
    <DataTable<VisitRow>
      columns={visitColumns(i18n.language)}
      rows={fixtureVisits}
      rowKey={(r) => r.id}
      zebra={zebra}
      maxHeight={maxHeight}
      rowTone={(r) => (r.waitMinutes > 40 ? "warn" : "none")}
      groupBy={(r) => ({ id: r.date.slice(0, 7), label: monthLabel(r.date, i18n.language) })}
      subRow={(r) => r.note}
      sort={sort}
      onSort={sortable ? (id) => setSort((s) => (s?.id === id ? { id, dir: s.dir === "asc" ? "desc" : "asc" } : { id, dir: "asc" })) : undefined}
      selected={selectable ? selected : undefined}
      onSelect={selectable ? (id) => setSelected((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id])) : undefined}
      emptyState={t("clinic.table.empty")}
    />
  )
}

export const Playground: Story = {
  argTypes: {
    zebra: { control: "boolean" },
    maxHeight: { control: "number" },
    sortable: { control: "boolean" },
    selectable: { control: "boolean" },
    density: { control: "radio", options: ["comfortable", "compact", "dense"] },
  } as unknown as Meta<typeof DataTable>["argTypes"],
  render: (args: any) => (
    <AtDensity density={args.density ?? "compact"}>
      <GroupedDemo zebra={args.zebra} maxHeight={args.maxHeight} sortable={args.sortable ?? true} selectable={args.selectable ?? true} />
    </AtDensity>
  ),
}

export const Default: Story = {
  name: "Default",
  render: () => <GroupedDemo zebra maxHeight={240} sortable selectable />,
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-things-gray-3">Grouped + zebra + warn tone + sub-row</p>
        <GroupedDemo zebra maxHeight={180} sortable={false} selectable={false} />
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-things-gray-3">Selection, no zebra</p>
        <SelectionDemo />
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-things-gray-3">Empty</p>
        <PlainDemo rows={[]} maxHeight={160} />
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-things-gray-3">Loading (static muted — no shimmer, 02 §8)</p>
        <LoadingDemo />
      </div>
    </div>
  ),
}


/** Plain, ungrouped table — shared by Empty / Narrow / LongList. */
function PlainDemo({ rows, maxHeight = 200, zebra = false, tone = false, narrow = false, emptyState }: {
  rows: VisitRow[]; maxHeight?: number; zebra?: boolean; tone?: boolean; narrow?: boolean; emptyState?: React.ReactNode
}) {
  const { i18n } = useTranslation()
  return (
    <DataTable<VisitRow>
      columns={visitColumns(i18n.language, { narrow })}
      rows={rows}
      rowKey={(r) => r.id}
      zebra={zebra}
      maxHeight={maxHeight}
      rowTone={tone ? (r) => (r.waitMinutes > 40 ? "warn" : "none") : undefined}
      emptyState={emptyState}
    />
  )
}

function SelectionDemo() {
  const [selected, setSelected] = useState<string[]>(["v03"])
  const { i18n } = useTranslation()
  return (
    <DataTable<VisitRow>
      columns={visitColumns(i18n.language)}
      rows={fixtureVisits.slice(0, 5)}
      rowKey={(r) => r.id}
      maxHeight={180}
      selected={selected}
      onSelect={(id) => setSelected((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]))}
    />
  )
}

function LoadingDemo() {
  const { t } = useTranslation()
  return (
    <PlainDemo rows={[]} maxHeight={160} emptyState={<span className="text-things-gray-3">{t("clinic.table.loading")}</span>} />
  )
}

export const Empty: Story = { render: () => <PlainDemo rows={[]} maxHeight={200} /> }

export const Loading: Story = { render: () => <LoadingDemo /> }

export const Dense: Story = {
  decorators: [(Story) => <AtDensity density="dense"><Story /></AtDensity>],
  render: () => <GroupedDemo zebra maxHeight={200} sortable={false} selectable={false} />,
}

export const Thai: Story = {
  render: () => (
    <ForcedLocale locale="th">
      <AtDensity density="dense">
        <GroupedDemo zebra maxHeight={220} sortable={false} selectable={false} />
      </AtDensity>
    </ForcedLocale>
  ),
}

export const Japanese: Story = {
  render: () => (
    <ForcedLocale locale="ja">
      <AtDensity density="compact">
        <GroupedDemo zebra maxHeight={220} sortable={false} selectable={false} />
      </AtDensity>
    </ForcedLocale>
  ),
}

/** Scroll-locked proof (06 §1): at 390px the sticky first column and sticky
 * header hold while the rest of the row scrolls away. */
export const Narrow: Story = {
  render: () => (
    <AtDensity density="compact">
      <div className="max-w-[390px] rounded-md border border-things-hairline">
        <PlainDemo rows={fixtureVisits} maxHeight={240} zebra tone narrow />
      </div>
    </AtDensity>
  ),
}

/** 500 rows — windowed rendering (virtualizeAbove default 200). */
export const LongList: Story = {
  render: () => {
    const rows = Array.from({ length: 500 }, (_, i) => ({ ...fixtureVisits[i % fixtureVisits.length], id: `g${String(i).padStart(3, "0")}` }))
    return <PlainDemo rows={rows} maxHeight={320} tone />
  },
}
