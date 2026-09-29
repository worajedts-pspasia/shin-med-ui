import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { AbnormalFlag } from "./AbnormalFlag"
import { DataTable } from "./DataTable"
import type { LabFlag } from "./types"

// ResultTable — lab results with flags, ranges and interpretive notes
// (04, Layer 5; EHR-Orders-and-Labs, 02.4). Over DataTable: panel grouping
// via groupBy, abnormal rows tinted, and the VALUE itself takes the severity
// colour — the eye lands on the value. Interpretive text renders as a
// monospace sub-row, as the source does. HH/LL rows add a 2px critical left
// accent. nameLocal renders the bilingual pair.

export interface ResultAnalyte {
  id: string
  name: string
  nameLocal?: string
  value?: string
  flag?: LabFlag
  range?: string
  uom?: string
  note?: string
  collectedAt?: string
}

export interface ResultPanel {
  id: string
  name: string
  nameLocal?: string
  receivedAt?: string
  analytes: ResultAnalyte[]
}

const flagTone = (f?: LabFlag): "none" | "warn" | "critical" =>
  f === "H" || f === "L" || f === "A" ? "warn" : f === "HH" || f === "LL" ? "critical" : "none"

export function ResultTable({
  panels,
  dense = false,
  maxHeight = 340,
  fit = false,
  className,
}: {
  panels: ResultPanel[]
  dense?: boolean
  maxHeight?: number | string
  /** Fit mode: only the sticky analyte keeps a width; other columns flex so
   *  the table fills its container (paper reports) instead of demanding its
   *  ~780px min-content and scrolling internally. */
  fit?: boolean
  className?: string
}) {
  const { t, i18n } = useTranslation()
  const W = (w: number | undefined, sticky?: boolean) => (fit && !sticky ? undefined : w)

  const rows = useMemo(
    () =>
      panels.flatMap((p) =>
        p.analytes.map((a) => ({ ...a, panelId: p.id, panelName: p.name, receivedAt: p.receivedAt })),
      ),
    [panels],
  )

  const receivedLabel = (iso?: string) =>
    iso ? new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso)) : undefined

  return (
    <div data-slot="result-table" data-density={dense ? "dense" : undefined} className={cn(className)}>
      <DataTable<(typeof rows)[number]>
        columns={[
          {
            id: "name",
            header: t("clinic.result.analyte"),
            width: W(210, true),
            sticky: "start",
            cell: (r) => (
              <span className="min-w-0">
                <span className="text-things-title">{r.name}</span>
                {r.nameLocal && i18n.language !== "en" && <span className="ml-1.5 text-xs text-things-gray-3">{r.nameLocal}</span>}
              </span>
            ),
          },
          {
            id: "value",
            header: t("clinic.result.value"),
            width: W(90),
            numeric: true,
            cell: (r) => (
              <span className={cn("clinic-num", r.flag && r.flag !== "N" && flagTone(r.flag) === "critical" ? "text-clinic-critical" : r.flag && r.flag !== "N" ? "text-clinic-warn" : "text-things-title")}>
                {r.value ?? "—"}
              </span>
            ),
          },
          { id: "flag", header: t("clinic.result.flag"), width: W(54), cell: (r) => (r.flag ? <AbnormalFlag flag={r.flag} /> : null) },
          { id: "range", header: t("clinic.result.range"), width: W(90), numeric: true, priority: "secondary", cell: (r) => r.range ?? "—" },
          { id: "uom", header: t("clinic.result.uom"), width: W(64), priority: "secondary", cell: (r) => r.uom ?? "—" },
          { id: "status", header: t("clinic.result.status"), width: W(64), priority: "secondary", cell: () => t("clinic.result.final") },
          {
            id: "collected",
            header: t("clinic.result.collected"),
            width: W(92),
            priority: "secondary",
            cell: (r) =>
              r.collectedAt ? (
                <span className="clinic-num text-xs text-things-gray-2">
                  {new Intl.DateTimeFormat(i18n.language, { month: "short", day: "2-digit" }).format(new Date(r.collectedAt))}
                </span>
              ) : (
                "—"
              ),
          },
        ]}
        rows={rows}
        rowKey={(r) => `${r.panelId}:${r.id}`}
        zebra
        maxHeight={maxHeight}
        rowTone={(r) => flagTone(r.flag)}
        rowClass={(r) => (r.flag === "HH" || r.flag === "LL" ? "border-l-2 border-l-clinic-critical" : "")}
        groupBy={(r) => ({
          id: r.panelId,
          label: (
            <span>
              {r.panelName}
              {r.receivedAt && <span className="ml-2 font-normal text-things-gray-3">{receivedLabel(r.receivedAt)}</span>}
            </span>
          ),
        })}
        subRow={(r) =>
          r.note ? (
            <span className="font-mono text-xs text-things-gray-2">{r.note}</span>
          ) : undefined
        }
      />
    </div>
  )
}
