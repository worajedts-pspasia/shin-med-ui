import { useEffect, useMemo } from "react"
import { RefreshCw } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DataTable } from "./DataTable"
import { PatientName } from "./PatientName"
import { StatusDot } from "./StatusDot"
import { TriageDot, TriageLegend } from "./TriageDot"
import type { NameParts, Urgency, VisitStatus } from "./types"

// QueueTable — คิวตรวจ, on every Thai VB6 product screen (04, Layer 3). Carries
// BOTH orthogonal axes (00-corrections §1): urgency (ปกติ/รีบ/ด่วน — the
// TriageDot and the default sort, set at registration) and status (สถานะ — a
// separate column of flow dots). Rows tint at held/cancelled only; otherwise
// the dot carries it. Verdict stays Scroll-locked (00 §4): the stacked mobile
// mode was dropped, and the Narrow story proves the sticky behaviour.
// Scroll-locked over DataTable: this component is intentionally thin.

export interface QueueRow {
  id: string
  mrn: string
  name: NameParts
  arrivedAt: string
  waitMinutes?: number
  urgency: Urgency
  status: VisitStatus
  note?: string
}

const URGENCY_RANK: Record<Urgency, number> = { urgent: 0, rush: 1, routine: 2 }

export function QueueTable({
  rows,
  selectedId,
  onSelect,
  onRefresh,
  autoRefreshMs,
  legend = ["routine", "rush", "urgent"],
  maxHeight = 320,
  className,
}: {
  rows: QueueRow[]
  selectedId?: string
  onSelect?: (id: string) => void
  onRefresh?: () => void
  autoRefreshMs?: number
  /** Urgency levels the legend shows (default: all three). */
  legend?: Urgency[]
  maxHeight?: number | string
  className?: string
}) {
  const { t } = useTranslation()

  useEffect(() => {
    if (!onRefresh || !autoRefreshMs) return
    const timer = setInterval(onRefresh, autoRefreshMs)
    return () => clearInterval(timer)
  }, [onRefresh, autoRefreshMs])

  // default sort: urgency first (urgent → rush → routine), then longest wait
  const sorted = useMemo(
    () =>
      [...rows].sort((a, b) => {
        const u = URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency]
        return u !== 0 ? u : (b.waitMinutes ?? 0) - (a.waitMinutes ?? 0)
      }),
    [rows],
  )

  const counts = useMemo(() => {
    const c: Record<Urgency, number> = { routine: 0, rush: 0, urgent: 0 }
    for (const r of rows) c[r.urgency]++
    return c
  }, [rows])

  return (
    <div data-slot="queue-table" className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <TriageLegend levels={legend} counts={counts} />
        {onRefresh && (
          <Button variant="ghost" size="icon-xs" aria-label={t("clinic.queue.refresh")} onClick={onRefresh}>
            <RefreshCw aria-hidden="true" />
          </Button>
        )}
      </div>

      <DataTable<QueueRow>
        columns={[
          {
            id: "urgency",
            header: t("clinic.queue.urgency"),
            width: 56,
            sticky: "start",
            cell: (r) => <TriageDot level={r.urgency} showLabel={false} />,
          },
          {
            id: "mrn",
            header: t("clinic.patient.mrn"),
            width: 76,
            sticky: "start",
            cell: (r) => <span className="font-mono text-xs text-things-gray-2">{r.mrn}</span>,
          },
          {
            id: "name",
            header: t("clinic.queue.name"),
            width: 150,
            cell: (r) =>
              onSelect ? (
                <button
                  type="button"
                  onClick={() => onSelect(r.id)}
                  className="text-left text-things-blue hover:underline focus-visible:underline"
                >
                  <PatientName parts={r.name} />
                </button>
              ) : (
                <PatientName parts={r.name} />
              ),
          },
          { id: "arrived", header: t("clinic.queue.arrived"), width: 60, numeric: true, cell: (r) => r.arrivedAt },
          {
            id: "wait",
            header: t("clinic.queue.wait"),
            width: 70,
            numeric: true,
            cell: (r) => (r.waitMinutes !== undefined ? t("clinic.queue.waitMinutes", { minutes: r.waitMinutes }) : "—"),
          },
          { id: "status", header: t("clinic.queue.status"), width: 92, cell: (r) => <StatusDot tone={r.status} size="sm" /> },
          {
            id: "note",
            header: t("clinic.queue.note"),
            width: 110,
            priority: "secondary",
            cell: (r) =>
              r.note ? (
                <span className="block max-w-40 truncate text-xs text-things-gray-3" title={r.note}>
                  {r.note}
                </span>
              ) : null,
          },
        ]}
        rows={sorted}
        rowKey={(r) => r.id}
        zebra
        maxHeight={maxHeight}
        rowClass={(r) =>
          r.id === selectedId
            ? "bg-things-blue-soft"
            : r.status === "held"
              ? "bg-clinic-lane"
              : r.status === "cancelled"
                ? "bg-card text-things-gray-3 line-through"
                : ""
        }
      />
    </div>
  )
}
