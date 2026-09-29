import { useMemo, useState } from "react"
import { LineChart } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DataTable } from "./DataTable"
import { toneText } from "./tokens"

// FlowsheetGrid — measures down, encounters across (04, Layer 5;
// EHR-Flow-Sheets, PSP matrix). The canonical scroll-locked component:
// sticky first column and sticky header are NOT optional — they come from
// DataTable. Section rows render on clinic-lane. Row checkboxes feed onPlot,
// turning any subset into a TrendChart (the source draws the chart icon and
// never delivers). Column pagination newest-first; "Row a of b" pager.

export interface FlowSectionDef {
  id: string
  label: string
  rows: Array<{ id: string; label: string; unit?: string; range?: [number, number] }>
}

export interface FlowsheetGridProps {
  sections: FlowSectionDef[]
  columns: Array<{ id: string; at: string; label?: React.ReactNode }>
  /** values[colId][rowId] */
  values: Record<string, Record<string, { value: number; flag?: "none" | "ok" | "warn" | "critical" }>>
  onCellSelect?: (rowId: string, colId: string) => void
  onPlot?: (rowIds: string[]) => void
  onlyRowsWithData?: boolean
  maxColumns?: number
  maxHeight?: number | string
  className?: string
}

export function FlowsheetGrid({
  sections,
  columns,
  values,
  onCellSelect,
  onPlot,
  onlyRowsWithData = false,
  maxColumns = 7,
  maxHeight = 320,
  className,
}: FlowsheetGridProps) {
  const { t, i18n } = useTranslation()
  const [colPage, setColPage] = useState(0)
  const [selected, setSelected] = useState<string[]>([])

  // newest first, paginated
  const sortedCols = useMemo(() => [...columns].sort((a, b) => b.at.localeCompare(a.at)), [columns])
  const pageCount = Math.max(1, Math.ceil(sortedCols.length / maxColumns))
  const pageSafe = Math.min(colPage, pageCount - 1)
  const visibleCols = sortedCols.slice(pageSafe * maxColumns, pageSafe * maxColumns + maxColumns)

  const rows = useMemo(() => {
    const all = sections.flatMap((s) => s.rows.map((r) => ({ ...r, sectionId: s.id, sectionLabel: s.label })))
    if (!onlyRowsWithData) return all
    return all.filter((r) => visibleCols.some((c) => values[c.id]?.[r.id] !== undefined))
  }, [sections, onlyRowsWithData, visibleCols, values])

  const dayLabel = (iso: string) =>
    new Intl.DateTimeFormat(i18n.language, { month: "short", day: "2-digit", timeZone: "UTC" }).format(new Date(iso))

  return (
    <div data-slot="flowsheet-grid" className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-things-gray-3">
          {t("clinic.flow.encounters", { shown: visibleCols.length, total: sortedCols.length })}
        </span>
        <div className="flex items-center gap-2">
          {onPlot && selected.length > 0 && (
            <Button variant="outline" size="xs" onClick={() => onPlot(selected)}>
              <LineChart className="size-3" aria-hidden="true" />
              {t("clinic.flow.plot", { count: selected.length })}
            </Button>
          )}
          {pageCount > 1 && (
            <span className="flex items-center overflow-hidden rounded-md border border-things-hairline">
              <Button variant="ghost" size="icon-xs" aria-label={t("clinic.pager.prev")} disabled={pageSafe === 0} onClick={() => setColPage(pageSafe - 1)} className="rounded-none">
                ‹
              </Button>
              <span className="clinic-num px-1.5 text-xs text-things-gray-3">
                {pageSafe + 1}/{pageCount}
              </span>
              <Button variant="ghost" size="icon-xs" aria-label={t("clinic.pager.next")} disabled={pageSafe === pageCount - 1} onClick={() => setColPage(pageSafe + 1)} className="rounded-none">
                ›
              </Button>
            </span>
          )}
        </div>
      </div>

      <DataTable<(typeof rows)[number]>
        columns={[
          {
            id: "measure",
            header: t("clinic.flow.measure"),
            width: 170,
            sticky: "start",
            cell: (r) => (
              <span className="min-w-0">
                <span className="text-things-title">{r.label}</span>
                {r.unit && <span className="ml-1 text-[11px] text-things-gray-3">{r.unit}</span>}
              </span>
            ),
          },
          ...visibleCols.map((c) => ({
            id: c.id,
            header: <span className="clinic-num">{c.label ?? dayLabel(c.at)}</span>,
            width: 84,
            numeric: true,
            cell: (r: (typeof rows)[number]) => {
              const v = values[c.id]?.[r.id]
              if (!v) return <span className="text-things-gray-3">—</span>
              const out = r.range && (v.value < r.range[0] || v.value > r.range[1])
              return (
                <button
                  type="button"
                  onClick={() => onCellSelect?.(r.id, c.id)}
                  className={cn(
                    "clinic-num rounded px-1 text-right",
                    onCellSelect && "hover:bg-things-hover",
                    v.flag === "warn" || out ? toneText.warn : v.flag === "critical" ? toneText.critical : v.flag === "ok" ? toneText.ok : "text-things-title",
                  )}
                >
                  {v.value}
                </button>
              )
            },
          })),
        ]}
        rows={rows}
        rowKey={(r) => r.id}
        zebra
        maxHeight={maxHeight}
        selected={onPlot ? selected : undefined}
        onSelect={onPlot ? (id) => setSelected((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id])) : undefined}
        groupBy={(r) => ({ id: r.sectionId, label: r.sectionLabel })}
      />

      <p className="clinic-num border-t border-things-hairline px-1 pt-1 text-right text-xs text-things-gray-3">
        {t("clinic.flow.rows", { count: rows.length })}
      </p>
    </div>
  )
}
