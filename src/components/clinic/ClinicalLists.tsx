import { OctagonAlert, TriangleAlert, Info, CircleSlash, Ban } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { DataTable } from "./DataTable"

// Clinical lists over DataTable (04, Layer 6): the problem list, the
// medication list and the care-gap table are thin — the interesting logic is
// tone discipline. AllergyList is a Fluid row list instead (04).

// ——— ProblemTable ———

export interface ProblemListRow {
  id: string
  alert?: boolean
  priority: "primary" | "secondary"
  code: string
  description: string
  onset: string
  modified: string
  note?: string
  status: "active" | "resolved"
}

export function ProblemTable({ rows, maxHeight = 260, className }: { rows: ProblemListRow[]; maxHeight?: number | string; className?: string }) {
  const { t } = useTranslation()
  const d = (iso: string) => new Intl.DateTimeFormat(undefined, { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(iso))
  return (
    <DataTable<ProblemListRow>
      className={className}
      columns={[
        {
          id: "alert", header: "", width: 30, sticky: "start",
          cell: (r) => (r.alert ? <OctagonAlert className="size-3.5 text-clinic-critical" aria-label={t("clinic.problem.alert")} /> : null),
        },
        {
          id: "priority", header: t("clinic.problem.priority"), width: 70,
          cell: (r) => <span className="text-xs text-things-gray-2">{t(`clinic.problem.priority.${r.priority}`)}</span>,
        },
        { id: "code", header: t("clinic.problem.code"), width: 74, cell: (r) => <span className="font-mono text-xs text-things-gray-2">{r.code}</span> },
        {
          id: "description", header: t("clinic.problem.description"), width: 220,
          cell: (r) => <span className={cn("text-things-title", r.status === "resolved" && "text-things-gray-3 line-through")}>{r.description}</span>,
        },
        { id: "onset", header: t("clinic.problem.onset"), width: 90, numeric: true, priority: "secondary", cell: (r) => d(r.onset) },
        { id: "modified", header: t("clinic.problem.modified"), width: 90, numeric: true, cell: (r) => d(r.modified) },
        { id: "note", header: t("clinic.problem.note"), width: 140, priority: "secondary", cell: (r) => r.note ?? "—" },
      ]}
      rows={rows}
      rowKey={(r) => r.id}
      zebra
      maxHeight={maxHeight}
    />
  )
}

// ——— AllergyList ———

export interface AllergyListRow {
  id: string
  allergen: string
  reactions: string[]
  severity?: "mild" | "moderate" | "severe"
  onsetAt?: string
  source?: string
}

const SEVERITY_TONE = { mild: "none", moderate: "warn", severe: "critical" } as const

export function AllergyList({ allergies, onRowClick, className }: { allergies: AllergyListRow[]; onRowClick?: (id: string) => void; className?: string }) {
  const { t } = useTranslation()
  return (
    <ul data-slot="allergy-list" className={cn("flex flex-col", className)}>
      {allergies.map((a) => {
        const tone = SEVERITY_TONE[a.severity ?? "mild"]
        return (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => onRowClick?.(a.id)}
              className={cn("flex w-full flex-wrap items-baseline gap-x-2 gap-y-0.5 border-b border-clinic-grid-line px-2 py-1.5 text-left last:border-b-0 hover:bg-things-hover", onRowClick ? "" : "cursor-default")}
            >
              <TriangleAlert className={cn("size-3.5 shrink-0 self-center", tone === "critical" ? "text-clinic-critical" : tone === "warn" ? "text-clinic-warn" : "text-things-gray-3")} aria-hidden="true" />
              <span className="text-sm font-medium text-things-title">{a.allergen}</span>
              <span className="text-xs text-things-gray-2">→ {a.reactions.join(", ")}</span>
              <span className="ml-auto flex items-baseline gap-2 text-[11px] text-things-gray-3">
                {a.severity && <span className={tone === "critical" ? "text-clinic-critical" : tone === "warn" ? "text-clinic-warn" : ""}>{t(`clinic.allergy.severity.${a.severity}`)}</span>}
                {a.onsetAt && <span className="clinic-num">{a.onsetAt}</span>}
                {a.source && <span>{a.source}</span>}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

// ——— MedicationList ———

export interface MedListDisplayRow {
  id: string
  group: "current" | "historical"
  status: "active" | "stopped" | "held"
  interaction?: "warning" | "info"
  start: string
  drug: string
  dose: string
  sig: string
  lastRefill?: string
  prescriber: string
}

export function MedicationList({ rows, onDrugInfo, maxHeight = 260, className }: { rows: MedListDisplayRow[]; onDrugInfo?: (id: string) => void; maxHeight?: number | string; className?: string }) {
  const { t } = useTranslation()
  const d = (iso?: string) => (iso ? new Intl.DateTimeFormat(undefined, { month: "short", day: "2-digit", year: "2-digit", timeZone: "UTC" }).format(new Date(iso)) : "—")
  return (
    <DataTable<MedListDisplayRow>
      className={className}
      columns={[
        {
          id: "flag", header: "!", width: 28, sticky: "start",
          cell: (r) =>
            r.interaction === "warning" ? (
              <TriangleAlert className="size-3.5 text-clinic-warn" aria-label={t("clinic.medlist.interaction")} />
            ) : r.status === "stopped" ? (
              <CircleSlash className="size-3.5 text-things-gray-3" aria-label={t(`clinic.med.status.${r.status}`)} />
            ) : r.interaction === "info" ? (
              <Info className="size-3.5 text-things-blue" aria-label={t("clinic.medlist.info")} />
            ) : null,
        },
        { id: "start", header: t("clinic.medlist.start"), width: 76, numeric: true, cell: (r) => d(r.start) },
        {
          id: "drug", header: t("clinic.medlist.drug"), width: 210,
          cell: (r) => (
            <button type="button" onClick={() => onDrugInfo?.(r.id)} className="text-left text-things-blue hover:underline" aria-label={`${r.drug} — ${t("clinic.medlist.drugInfo")}`}>
              {r.drug} {r.dose}
            </button>
          ),
        },
        { id: "sig", header: "Sig", width: 90, cell: (r) => <span className="font-mono text-xs text-things-gray-2">{r.sig}</span> },
        { id: "refill", header: t("clinic.medlist.lastRefill"), width: 84, numeric: true, priority: "secondary", cell: (r) => d(r.lastRefill) },
        { id: "prescriber", header: t("clinic.medlist.prescriber"), width: 140, priority: "secondary", cell: (r) => r.prescriber },
      ]}
      rows={rows}
      rowKey={(r) => r.id}
      zebra
      maxHeight={maxHeight}
      rowClass={(r) =>
        r.status === "stopped"
          ? "bg-card text-things-gray-3"
          : r.status === "held"
            ? "bg-clinic-lane"
            : r.interaction === "warning"
              ? "bg-clinic-warn-soft"
              : ""
      }
      groupBy={(r) => ({ id: r.group, label: t(`clinic.medlist.group.${r.group}`) })}
    />
  )
}

// ——— CareGapTable ———

export interface CareGapDisplayRow {
  id: string
  protocolId: string
  protocol: string
  guideline?: string
  measure: string
  interval: string
  due: boolean
  todayResult: string
  todayTone?: "ok" | "warn"
  previousResult: string
  previousDate: string
}

export function CareGapTable({ rows, maxHeight = 260, className }: { rows: CareGapDisplayRow[]; maxHeight?: number | string; className?: string }) {
  const { t } = useTranslation()
  const allMet = rows.every((r) => !r.due)
  return (
    <div className={cn("flex flex-col", className)}>
      <DataTable<CareGapDisplayRow>
        columns={[
          { id: "measure", header: t("clinic.gap.measure"), width: 170, sticky: "start", cell: (r) => <span className="text-things-title">{r.measure}</span> },
          {
            id: "interval", header: t("clinic.gap.interval"), width: 100,
            cell: (r) => <span className={cn("text-xs", r.due ? "text-clinic-warn" : "text-things-gray-2")}>{r.interval}</span>,
          },
          {
            id: "today", header: t("clinic.gap.today"), width: 100, numeric: true,
            cell: (r) => <span className={cn("clinic-num", r.todayTone === "warn" ? "text-clinic-warn" : r.todayTone === "ok" ? "text-clinic-ok" : "text-things-title")}>{r.todayResult}</span>,
          },
          { id: "previous", header: t("clinic.gap.previous"), width: 100, numeric: true, priority: "secondary", cell: (r) => <span className="clinic-num text-things-gray-2">{r.previousResult}</span> },
          { id: "prevDate", header: t("clinic.gap.previousDate"), width: 90, numeric: true, priority: "secondary", cell: (r) => r.previousDate },
        ]}
        rows={rows}
        rowKey={(r) => r.id}
        zebra
        maxHeight={maxHeight}
        groupBy={(r) => ({
          id: r.protocolId,
          label: (
            <span className="flex items-center gap-2">
              {r.protocol}
              {r.guideline && <span className="font-normal text-things-blue underline decoration-things-blue/40">{r.guideline}</span>}
            </span>
          ),
        })}
      />
      {allMet && (
        <p data-all-clear className="flex items-center gap-1.5 border-t border-things-hairline px-2 py-1.5 text-xs text-clinic-ok">
          <Ban className="size-3.5" aria-hidden="true" />
          {t("clinic.gap.allMet")}
        </p>
      )}
    </div>
  )
}
