import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { BedDouble, ChevronDown, ChevronRight, Globe, KeyRound, LayoutGrid, List, Plus, RotateCw, Search, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import i18n, { setLocale, type Locale } from "@/i18n"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { DataTable, type DataTableColumn } from "@/components/clinic/DataTable"
import { docsDesc } from "@/lib/docs-desc"
import { ActionToolbar } from "@/components/clinic/ActionToolbar"
import { CategoryLegend } from "@/components/clinic/CategoryLegend"
import { CollapsiblePanel } from "@/components/clinic/CollapsiblePanel"
import { StatusDot } from "@/components/clinic/StatusDot"
import { Card } from "@/components/ui/card"
import {
  Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle,
} from "@/components/ui/empty"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// Recipes (issue #1) — compositions the clinic screens need that are NOT
// components of their own. Each recipe is a story made only of existing
// components; a Docs page keeps them consistent. Register as stories, never
// as components.

const meta: Meta = {
  // two-level title so Recipes renders as its own sidebar section (a bare
  // top-level title is pinned above every section, ignoring storySort)
  title: "Recipes/Clinic Recipes",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: { description: { component: docsDesc("Recipes") } },
  },
}
export default meta
type Story = StoryObj

function Frame({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="max-w-xl space-y-2">
      {children}
      {hint && <p className="text-xs text-things-gray-3">{hint}</p>}
    </div>
  )
}

/* ——— 1. Setup progress bar (SCR-022) ——————————————————————————— */

const SETUP_ITEMS = [
  { id: "clinic", label: "Clinic profile", done: true },
  { id: "providers", label: "Providers", done: true },
  { id: "hours", label: "Opening hours", done: false },
  { id: "billing", label: "Billing", done: false },
]

function SetupProgressDemo() {
  const { t } = useTranslation()
  const [collapsed, setCollapsed] = useState(false)
  const doneCount = SETUP_ITEMS.filter((x) => x.done).length
  const pct = Math.round((doneCount / SETUP_ITEMS.length) * 100)
  const next = SETUP_ITEMS.find((x) => !x.done)

  if (collapsed) {
    return (
      <Frame>
        <div className="flex items-center gap-2">
          <Progress value={pct} className="h-2 flex-1" />
          <span className="clinic-num text-sm font-medium text-things-title">{pct}%</span>
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(false)} aria-expanded={false}>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            {t("recipes.expand")}
          </Button>
        </div>
      </Frame>
    )
  }
  return (
    <Frame hint="Two labelled Progress bars, tabular percents, a link to the next incomplete item, a warning badge while incomplete, collapse to one line.">
      <div className="space-y-3 rounded-md border border-things-hairline bg-card p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-things-title">{t("recipes.setupTitle")}</span>
          <div className="flex items-center gap-2">
            {pct < 100 && <Badge variant="outline" className="border-clinic-warn/40 text-clinic-warn">{t("recipes.incomplete")}</Badge>}
            <Button variant="ghost" size="sm" onClick={() => setCollapsed(true)} aria-expanded>
              <ChevronDown className="size-3.5" aria-hidden="true" />
              {t("recipes.collapse")}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Progress value={pct} className="h-2.5 flex-1" />
          <span className="clinic-num w-10 text-right text-sm font-semibold text-things-title">{pct}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Progress value={(doneCount / SETUP_ITEMS.length) * 100} className="h-1.5 flex-1" />
          <span className="clinic-num text-xs text-things-gray-2">{doneCount}/{SETUP_ITEMS.length}</span>
        </div>
        {next && (
          <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-things-blue underline-offset-4 hover:underline">
            {t("recipes.next")}: {next.label} →
          </a>
        )}
      </div>
    </Frame>
  )
}

export const SetupProgressBar: Story = { render: () => <SetupProgressDemo /> }

/* ——— 2. Weekly hours (SCR-005/007) ——————————————————————————— */

type DayRow = { id: string; day: string; open: boolean; periods: { from: string; to: string }[] }
const WEEK: DayRow[] = [
  { id: "mon", day: "Monday", open: true, periods: [{ from: "08:30", to: "17:00" }] },
  { id: "tue", day: "Tuesday", open: true, periods: [{ from: "08:30", to: "17:00" }] },
  { id: "wed", day: "Wednesday", open: true, periods: [{ from: "08:30", to: "12:00" }, { from: "13:30", to: "17:00" }] },
  { id: "thu", day: "Thursday", open: true, periods: [{ from: "08:30", to: "17:00" }] },
  { id: "fri", day: "Friday", open: true, periods: [{ from: "08:30", to: "16:00" }] },
  { id: "sat", day: "Saturday", open: false, periods: [] },
]

function TimeRange({ from, to, onRemove }: { from: string; to: string; onRemove: () => void }) {
  return (
    <InputGroup>
      <InputGroupInput type="time" defaultValue={from} aria-label="from" className="h-8 w-28 text-sm" />
      <InputGroupText>–</InputGroupText>
      <InputGroupInput type="time" defaultValue={to} aria-label="to" className="h-8 w-28 text-sm" />
      <InputGroupAddon>
        <InputGroupButton variant="ghost" size="icon-xs" aria-label="Remove period" onClick={onRemove}>
          <X aria-hidden="true" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

function WeeklyHoursDemo() {
  const { t } = useTranslation()
  const [rows, setRows] = useState(WEEK)
  const columns: Array<DataTableColumn<DayRow>> = [
    { id: "day", header: t("recipes.day"), sticky: "start", width: 110, cell: (r) => <span className="font-medium text-things-title">{r.day}</span> },
    {
      id: "open",
      header: t("recipes.open"),
      width: 80,
      cell: (r) => (
        <Switch
          checked={r.open}
          aria-label={`${r.day} ${t("recipes.open")}`}
          onCheckedChange={(v) => setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, open: v, periods: v ? (x.periods.length ? x.periods : [{ from: "09:00", to: "17:00" }]) : [] } : x)))}
        />
      ),
    },
    {
      id: "periods",
      header: t("recipes.hours"),
      cell: (r) => (
        <div className="flex min-w-0 flex-wrap items-center gap-2 py-1">
          {r.open ? (
            <>
              {r.periods.map((p, i) => (
                <TimeRange key={i} from={p.from} to={p.to} onRemove={() => setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, periods: x.periods.filter((_, j) => j !== i) } : x)))} />
              ))}
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={t("recipes.addPeriod")}
                onClick={() => setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, periods: [...x.periods, { from: "09:00", to: "17:00" }] } : x)))}
              >
                <Plus aria-hidden="true" />
              </Button>
            </>
          ) : (
            <span className="text-sm text-things-gray-3">{t("recipes.closed")}</span>
          )}
        </div>
      ),
    },
    {
      id: "copy",
      header: "",
      align: "end",
      width: 110,
      cell: (r) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 text-xs" aria-label={t("recipes.copyTo", { day: r.day })}>
              {t("recipes.copy")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {rows.filter((x) => x.id !== r.id).map((x) => (
              <DropdownMenuRadioItem key={x.id} value={x.id} onSelect={() => setRows((prev) => prev.map((y) => (y.id === x.id ? { ...y, open: r.open, periods: r.periods.map((p) => ({ ...p })) } : y)))}>
                {x.day}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
  return (
    <Frame hint="DataTable rows (day, Switch, one InputGroup per period, add, copy-to-day). 'Copy to…' pastes this row's schedule onto the chosen day.">
      <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} className="rounded-md border border-things-hairline" />
    </Frame>
  )
}

export const WeeklyHours: Story = { render: () => <WeeklyHoursDemo /> }

/* ——— 3. Time range (SCR-005/007) ————————————————————————————— */

export const TimeRangeField: Story = {
  render: () => {
    const { t } = useTranslation()
    return (
      <Frame hint="One InputGroup holding two time Inputs and a small ghost icon Button to remove — the atom WeeklyHours repeats per period.">
        <TimeRange from="08:30" to="17:00" onRemove={() => {}} />
        <p className="sr-only">{t("recipes.hours")}</p>
      </Frame>
    )
  },
}

/* ——— 4. Language switcher (app shell header) ——————————————————— */

const LANGS: { code: Locale; native: string }[] = [
  { code: "th", native: "ไทย" },
  { code: "en", native: "English" },
  { code: "ja", native: "日本語" },
]

function LanguageSwitcherDemo() {
  const [current, setCurrent] = useState<Locale>((i18n.language as Locale) ?? "en")
  return (
    <Frame hint="Ghost button (globe + current code) opening radio items written in their own language; switches the live i18n locale.">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" aria-label="Language">
            <Globe className="size-3.5" aria-hidden="true" />
            <span className="clinic-num text-xs font-medium">{current.toUpperCase()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup value={current}>
            {LANGS.map((l) => (
              <DropdownMenuRadioItem
                key={l.code}
                value={l.code}
                onSelect={() => {
                  setLocale(l.code)
                  setCurrent(l.code)
                }}
              >
                {l.native}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Frame>
  )
}

export const LanguageSwitcher: Story = { render: () => <LanguageSwitcherDemo /> }

/* ——— 5. Email code entry (SCR-043) ——————————————————————————— */

export const EmailCodeEntry: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Six-digit code + Resend with countdown + passkey. No password fields or password-rule components anywhere in this design system — sign-in is email code, magic link or passkey (issue #1 §6).",
      },
    },
  },
  render: () => {
    const { t } = useTranslation()
    return (
      <Frame hint="Countdown shown in its deterministic 30s state; in the product it ticks while Resend is disabled.">
        <div className="space-y-4 rounded-md border border-things-hairline bg-card p-4">
          <p className="text-sm text-things-ink">{t("recipes.codeHint")}</p>
          <InputOTP maxLength={6} aria-label={t("recipes.codeLabel")}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" disabled className="gap-1.5">
              <RotateCw className="size-3.5" aria-hidden="true" />
              {t("recipes.resend")}
              <span className={cn("clinic-num text-xs text-things-gray-2")}>0:30</span>
            </Button>
            <Button variant="ghost" size="sm">
              <KeyRound className="size-3.5" aria-hidden="true" />
              {t("recipes.passkey")}
            </Button>
          </div>
        </div>
      </Frame>
    )
  },
}

/* ——— 6. Bed layout, nursing home (SCR-007 Layout view; issue #4) ————— */

type BedState = "available" | "reserved" | "occupied" | "out_of_service"
interface BedLayoutBed { code: string; state: BedState }
interface BedLayoutRoom {
  id: string; code: string; name?: string; type: string
  capacity: number; gender?: "female" | "male"; active: boolean; isTest?: boolean
  beds: BedLayoutBed[]
}
interface BedLayoutZone { id: string; name: string; rooms: BedLayoutRoom[] }

const BED_ZONES: BedLayoutZone[] = [
  { id: "a", name: "Building A · Floor 1", rooms: [
    { id: "r101", code: "Room 101", name: "Orchid", type: "Private", capacity: 1, gender: "female", active: true, beds: [{ code: "101-A", state: "occupied" }] },
    { id: "r102", code: "Room 102", type: "Shared 4-bed", capacity: 4, active: true, beds: [
      { code: "102-A", state: "occupied" }, { code: "102-B", state: "available" },
      { code: "102-C", state: "occupied" }, { code: "102-D", state: "available" },
    ] },
    { id: "r103", code: "Room 103", name: "Training", type: "Shared 2-bed", capacity: 2, active: true, isTest: true, beds: [
      { code: "103-A", state: "available" }, { code: "103-B", state: "reserved" },
    ] },
    { id: "r104", code: "Room 104", name: "Renovation", type: "Private", capacity: 1, active: false, beds: [{ code: "104-A", state: "out_of_service" }] },
  ] },
  { id: "b", name: "Building B · Floor 2", rooms: [
    { id: "r201", code: "Room 201", name: "Bougainvillea", type: "Private", capacity: 1, gender: "male", active: true, beds: [{ code: "201-A", state: "available" }] },
    { id: "r202", code: "Room 202", type: "Shared 2-bed", capacity: 2, active: true, beds: [
      { code: "202-A", state: "reserved" }, { code: "202-B", state: "out_of_service" },
    ] },
  ] },
]

// State → tokens (issue #4 §3): colour NEVER alone — tooltip + legend counts
// + strikethrough carry the state as well.
const BED_STATE = {
  available: { dot: "arrived" as const, chip: "bg-clinic-ok-soft", legend: "var(--color-clinic-ok)" },
  reserved: { dot: "accepted" as const, chip: "bg-clinic-warn-soft", legend: "var(--color-things-gold)" },
  occupied: { dot: "in-room" as const, chip: "bg-things-blue-soft", legend: "var(--color-things-blue)" },
  out_of_service: { dot: "pending" as const, chip: "bg-things-chip-soft", legend: "var(--color-things-gray)" },
}

function BedChip({ bed }: { bed: BedLayoutBed }) {
  const { t } = useTranslation()
  const meta = BED_STATE[bed.state]
  const oos = bed.state === "out_of_service"
  return (
    <span
      title={t(`recipes.bed.state.${bed.state}`)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-things-hairline px-2 py-0.5 text-xs",
        meta.chip,
        oos && "text-things-gray-2 line-through",
      )}
    >
      <StatusDot tone={meta.dot} size="sm" label="" />
      <span className="font-mono">{bed.code}</span>
    </span>
  )
}

function BedChips({ room }: { room: BedLayoutRoom }) {
  return (
    <span className="flex flex-wrap gap-1">
      {room.beds.map((b) => (
        <BedChip key={b.code} bed={b} />
      ))}
    </span>
  )
}

function roomA11yName(room: BedLayoutRoom, t: (k: string, opts?: { count?: number }) => string) {
  const counts = new Map<BedState, number>()
  for (const b of room.beds) counts.set(b.state, (counts.get(b.state) ?? 0) + 1)
  const parts = [...counts.entries()].map(
    ([state, n]) => `${n} ${t(`recipes.bed.state.${state}`)}`,
  )
  return `${room.code}, ${room.type}, ${room.beds.length} ${t("recipes.bed.beds", { count: room.beds.length })}: ${parts.join(", ")}`
}

function BedLayoutDemo({ zones }: { zones: BedLayoutZone[] }) {
  const { t } = useTranslation()
  const [view, setView] = useState<"layout" | "list">("layout")
  const [query, setQuery] = useState("")
  const [zoneId, setZoneId] = useState("all")
  const [selected, setSelected] = useState<string | null>(null)

  const q = query.trim().toLowerCase()
  const match = (r: BedLayoutRoom) =>
    !q ||
    r.code.toLowerCase().includes(q) ||
    (r.name ?? "").toLowerCase().includes(q) ||
    r.beds.some((b) => b.code.toLowerCase().includes(q))
  const visibleZones = zones
    .filter((z) => zoneId === "all" || z.id === zoneId)
    .map((z) => ({ ...z, rooms: z.rooms.filter(match) }))
    .filter((z) => z.rooms.length > 0)
  const totalRooms = visibleZones.reduce((n, z) => n + z.rooms.length, 0)
  const totalBeds = visibleZones.reduce((n, z) => n + z.rooms.reduce((m, r) => m + r.beds.length, 0), 0)

  const allBeds = zones.flatMap((z) => z.rooms.flatMap((r) => r.beds))
  const legendCategories = (Object.keys(BED_STATE) as BedState[]).map((s) => ({
    id: s,
    label: t(`recipes.bed.state.${s}`),
    color: BED_STATE[s].legend,
    count: allBeds.filter((b) => b.state === s).length,
  }))

  const listRows = visibleZones.flatMap((z) => z.rooms.map((r) => ({ ...r, zone: z.name })))
  const listColumns: Array<DataTableColumn<BedLayoutRoom & { zone: string }>> = [
    { id: "room", header: t("recipes.bed.room"), sticky: "start", width: 120, cell: (r) => <span className="font-medium text-things-title">{r.code}</span> },
    { id: "zone", header: t("recipes.bed.zone"), width: 170, priority: "secondary", cell: (r) => r.zone },
    { id: "type", header: t("recipes.bed.type"), width: 120, cell: (r) => r.type },
    { id: "beds", header: t("recipes.bed.beds"), cell: (r) => <BedChips room={r} /> },
  ]

  return (
    <Frame hint="Zones are CollapsiblePanels; rooms are card-buttons (Enter/Space work); bed chips wrap and never steal tab stops; Layout ⇄ List switches to a DataTable. Try searching a bed code.">
      <div className="space-y-3">
        {/* toolbar: add action + search + zone filter */}
        <div className="flex flex-wrap items-center gap-2">
          <ActionToolbar
            label={t("recipes.bed.toolbar")}
            actions={[{ id: "add-room", icon: Plus, label: t("recipes.bed.addRoom") }]}
          />
          <InputGroup>
            <InputGroupAddon>
              <Search className="size-3.5 text-things-gray-3" aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("recipes.bed.search")}
              aria-label={t("recipes.bed.search")}
              className="h-8 w-52 text-sm"
            />
          </InputGroup>
          <Select value={zoneId} onValueChange={setZoneId}>
            <SelectTrigger size="sm" className="w-48" aria-label={t("recipes.bed.zone")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("recipes.bed.zoneAll")}</SelectItem>
              {zones.map((z) => (
                <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(v) => { if (v) setView(v as "layout" | "list") }}
            variant="outline"
            size="sm"
            aria-label={t("recipes.bed.view")}
            className="ml-auto"
          >
            <ToggleGroupItem value="layout"><LayoutGrid className="size-3.5" aria-hidden="true" />{t("recipes.bed.layout")}</ToggleGroupItem>
            <ToggleGroupItem value="list"><List className="size-3.5" aria-hidden="true" />{t("recipes.bed.list")}</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <CategoryLegend categories={legendCategories} value={legendCategories.map((c) => c.id)} />

        {zones.length === 0 ? (
          <div className="rounded-md border border-things-hairline bg-card p-6">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BedDouble aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>{t("recipes.bed.noRooms")}</EmptyTitle>
              </EmptyHeader>
              <EmptyContent>
                <Button size="sm"><Plus className="size-3.5" aria-hidden="true" />{t("recipes.bed.addRoom")}</Button>
              </EmptyContent>
            </Empty>
          </div>
        ) : visibleZones.length === 0 ? (
          <div className="rounded-md border border-things-hairline bg-card p-6">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Search aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>{t("recipes.bed.noMatch")}</EmptyTitle>
              </EmptyHeader>
            </Empty>
          </div>
        ) : view === "list" ? (
          <DataTable columns={listColumns} rows={listRows} rowKey={(r) => r.id} className="rounded-md border border-things-hairline" />
        ) : (
          <div className="space-y-4">
            {visibleZones.map((z) => (
              <CollapsiblePanel
                key={z.id}
                variant="section"
                title={
                  <span className="flex flex-wrap items-baseline gap-2">
                    {z.name}
                    <span className="clinic-num text-xs font-normal text-things-gray-2">
                      {t("recipes.bed.meta", { rooms: z.rooms.length, beds: z.rooms.reduce((n, r) => n + r.beds.length, 0) })}
                    </span>
                  </span>
                }
              >
                <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(210px,1fr))]">
                  {z.rooms.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      data-room={r.id}
                      aria-label={roomA11yName(r, t)}
                      aria-pressed={selected === r.id || undefined}
                      onClick={() => setSelected(r.id)}
                      className={cn(
                        "flex flex-col gap-2 rounded-md border bg-card p-3 text-left shadow-xs transition-colors hover:border-things-blue/50 focus-visible:outline-2 focus-visible:outline-things-blue",
                        selected === r.id ? "border-things-blue" : "border-things-hairline",
                        !r.active && "opacity-75",
                      )}
                    >
                      <span className="flex w-full items-center gap-2">
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-things-title">{r.code}</span>
                        <Badge variant="outline" className="shrink-0 text-things-gray-2">{r.type}</Badge>
                      </span>
                      <span className="text-xs text-things-gray-2">
                        {[r.name, `${r.beds.length} ${t("recipes.bed.beds", { count: r.beds.length })}`, r.gender ? t(`recipes.bed.gender.${r.gender}`) : null].filter(Boolean).join(" · ")}
                      </span>
                      <BedChips room={r} />
                      {(r.isTest || !r.active) && (
                        <span className="flex gap-1.5">
                          {r.isTest && <Badge variant="outline" className="text-things-gray-2">{t("recipes.bed.test")}</Badge>}
                          {!r.active && <Badge variant="outline" className="border-clinic-critical/40 text-clinic-critical">{t("recipes.bed.inactive")}</Badge>}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </CollapsiblePanel>
            ))}
            <p data-bed-count className="clinic-num text-xs text-things-gray-3">
              {t("recipes.bed.meta", { rooms: totalRooms, beds: totalBeds })}
            </p>
          </div>
        )}
      </div>
    </Frame>
  )
}

export const BedLayout: Story = {
  parameters: { docs: { description: { story: "Nursing home SCR-007 Layout view (issue #4): zones → rooms → bed chips, read-mostly; occupancy is set by the admission workflow, not here. Colour never alone: state tooltips, legend counts, and strikethrough for out-of-service." } } },
  render: () => <BedLayoutDemo zones={BED_ZONES} />,
}

export const BedLayoutEmpty: Story = {
  parameters: { docs: { description: { story: "The empty branch with no rooms yet — bed icon and Add room." } } },
  render: () => <BedLayoutDemo zones={[]} />,
}
