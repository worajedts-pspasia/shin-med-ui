import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronDown, ChevronRight, Globe, KeyRound, Plus, RotateCw, X } from "lucide-react"
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
