import { Ban, Check, ChevronDown, CircleDashed, Eye, Save, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable, type DataTableColumn } from "./DataTable"

// ReconciliationList — Keep / Stop / Inactivate (04, Layer 5). The decision is
// a control, never a coloured label: ≥md a text-button menu ("Keep ▾" toned
// clinic-ok / clinic-critical / clinic-warn), <md a compact select. The
// reconciliation dialog itself is a screen composition (05), not this file.

export type ReconciliationDecision = "keep" | "stop" | "inactivate" | "undecided"
export type ReconciliationKind = "allergy" | "medication" | "problem"

export interface ReconciliationItem {
  id: string
  kind: ReconciliationKind
  label: string
  /** Dose / reaction / code — the meta the decision is made on. */
  detail?: string
  decision: ReconciliationDecision
}

// Static maps — the JIT cannot see template-built classes.
const DECISION_TONE: Record<ReconciliationDecision, string> = {
  keep: "text-clinic-ok",
  stop: "text-clinic-critical",
  inactivate: "text-clinic-warn",
  undecided: "text-things-gray-2",
}
const DECISION_GLYPH: Record<ReconciliationDecision, React.ReactNode> = {
  keep: <Check className="size-3.5" aria-hidden="true" />,
  stop: <X className="size-3.5" aria-hidden="true" />,
  inactivate: <Ban className="size-3.5" aria-hidden="true" />,
  undecided: <CircleDashed className="size-3.5" aria-hidden="true" />,
}
const DECISIONS: ReconciliationDecision[] = ["keep", "stop", "inactivate", "undecided"]

export function ReconciliationList({
  sections,
  items,
  onAction,
  onMarkReviewed,
  onPreview,
  onSave,
  className,
}: {
  /** Kinds to show; defaults to all three in canonical order. */
  sections?: ReconciliationKind[]
  items: ReconciliationItem[]
  onAction: (id: string, decision: ReconciliationDecision) => void
  onMarkReviewed?: () => void
  onPreview?: () => void
  onSave?: () => void
  className?: string
}) {
  const { t } = useTranslation()
  const kinds = sections ?? (["allergy", "medication", "problem"] as ReconciliationKind[])
  const rows = items.filter((it) => kinds.includes(it.kind))
  const undecided = rows.filter((r) => r.decision === "undecided").length

  const decisionLabel = (d: ReconciliationDecision) => t(`clinic.recon.${d}`)

  const decisionControl = (row: ReconciliationItem) => {
    const set = (d: ReconciliationDecision) => onAction(row.id, d)
    return (
      <>
        {/* ≥md: toned text-button menu */}
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                data-decision={row.decision}
                className={cn(
                  "inline-flex items-center gap-1 rounded-sm text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-things-blue",
                  DECISION_TONE[row.decision],
                )}
              >
                {decisionLabel(row.decision)}
                <ChevronDown className="size-3.5" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {DECISIONS.map((d) => (
                <DropdownMenuItem key={d} onSelect={() => set(d)}>
                  {DECISION_GLYPH[d]}
                  {decisionLabel(d)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* <md: compact select */}
        <div className="md:hidden">
          <Select value={row.decision} onValueChange={(v) => set(v as ReconciliationDecision)}>
            <SelectTrigger size="sm" className="h-7 w-32 text-xs" aria-label={decisionLabel(row.decision)}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DECISIONS.map((d) => (
                <SelectItem key={d} value={d}>
                  {decisionLabel(d)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </>
    )
  }

  const columns: Array<DataTableColumn<ReconciliationItem>> = [
    {
      id: "item",
      header: t("clinic.recon.item"),
      cell: (row) => (
        <div className="min-w-0 py-1">
          <div className="truncate font-medium text-things-title">{row.label}</div>
          {row.detail && <div className="truncate text-xs text-things-gray-2">{row.detail}</div>}
        </div>
      ),
    },
    {
      id: "decision",
      header: t("clinic.recon.decision"),
      width: 150,
      align: "end",
      cell: decisionControl,
    },
  ]

  return (
    <div className={cn("flex min-w-0 flex-col overflow-hidden rounded-md border border-things-hairline bg-card", className)}>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        groupBy={(r) => ({ id: r.kind, label: t(`clinic.recon.kind.${r.kind}`) })}
        emptyState={<p className="p-4 text-sm text-things-gray-3">{t("clinic.recon.empty")}</p>}
        className="flex-1"
      />
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-things-hairline px-3 py-2">
        <p className="clinic-num text-xs text-things-gray-2">
          {rows.length} {t("clinic.recon.items")} · {undecided} {t("clinic.recon.pending")}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={onMarkReviewed}>
            <Check className="size-3.5" aria-hidden="true" />
            {t("clinic.recon.reviewed")}
          </Button>
          <Button variant="ghost" size="sm" onClick={onPreview}>
            <Eye className="size-3.5" aria-hidden="true" />
            {t("clinic.recon.preview")}
          </Button>
          <Button size="sm" onClick={onSave}>
            <Save className="size-3.5" aria-hidden="true" />
            {t("clinic.recon.save")}
          </Button>
        </div>
      </div>
    </div>
  )
}
