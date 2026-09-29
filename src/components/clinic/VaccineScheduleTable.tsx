import { Syringe } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DataTable, type DataTableColumn } from "./DataTable"

// VaccineScheduleTable — series rows × date given / next due / site / route /
// reaction (04, Layer 9, EHR Immunizations). Scroll-locked via DataTable
// (sticky header + first column); the 20-field dose dialog is a screen
// composition (FormGrid in a ui/dialog — see the story).

export interface VaccineDose {
  id: string
  dose: string
  dateGiven?: string
  nextDue?: string
  site?: string
  route?: string
  reaction?: string
}

export interface VaccineSeries {
  id: string
  vaccine: string
  doses: VaccineDose[]
}

export function VaccineScheduleTable({
  series,
  onRecordDose,
  className,
}: {
  series: VaccineSeries[]
  onRecordDose?: (seriesId: string) => void
  className?: string
}) {
  const { t } = useTranslation()
  const rows = series.flatMap((s) => s.doses.map((d) => ({ ...d, seriesId: s.id, vaccine: s.vaccine })))

  const columns: Array<DataTableColumn<(typeof rows)[number]>> = [
    {
      id: "vaccine",
      header: t("clinic.vaccine.vaccine"),
      sticky: "start",
      width: 170,
      cell: (r) => <span className="font-medium text-things-title">{r.vaccine}</span>,
    },
    { id: "dose", header: t("clinic.vaccine.dose"), width: 130, cell: (r) => <span className="text-things-ink">{r.dose}</span> },
    {
      id: "dateGiven",
      header: t("clinic.vaccine.dateGiven"),
      numeric: true,
      width: 110,
      cell: (r) => <span className="text-things-ink">{r.dateGiven ?? "—"}</span>,
    },
    {
      id: "nextDue",
      header: t("clinic.vaccine.nextDue"),
      numeric: true,
      width: 110,
      cell: (r) => (
        <span className={cn(r.nextDue && "text-things-title")}>{r.nextDue ?? "—"}</span>
      ),
    },
    { id: "site", header: t("clinic.vaccine.site"), width: 90, priority: "secondary", cell: (r) => r.site ?? "—" },
    { id: "route", header: t("clinic.vaccine.route"), width: 80, priority: "secondary", cell: (r) => r.route ?? "—" },
    {
      id: "reaction",
      header: t("clinic.vaccine.reaction"),
      priority: "secondary",
      cell: (r) =>
        r.reaction ? <span className="text-clinic-warn">{r.reaction}</span> : <span className="text-things-gray-3">—</span>,
    },
    {
      id: "record",
      header: "",
      align: "end",
      width: 120,
      cell: (r) =>
        !r.dateGiven ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onRecordDose?.(r.seriesId)}
            aria-label={t("clinic.vaccine.record", { vaccine: r.vaccine })}
          >
            <Syringe className="size-3.5" aria-hidden="true" />
            {t("clinic.vaccine.recordShort")}
          </Button>
        ) : null,
    },
  ]

  return (
    <div
      data-slot="vaccine-schedule-table"
      className={cn("overflow-hidden rounded-md border border-things-hairline bg-card", className)}
    >
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        zebra
        groupBy={(r) => ({ id: r.seriesId, label: r.vaccine })}
        emptyState={<p className="p-4 text-sm text-things-gray-3">{t("clinic.vaccine.empty")}</p>}
      />
    </div>
  )
}
