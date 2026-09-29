import { OctagonAlert, Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ClinicalSummaryColumn — the attested clinical list panel (04, Layer 3;
// WinForms EMR triptych + attestation). "Reviewed <date>" is a CONTROL — clicking
// it re-attests. alert items carry the alert glyph + clinic-critical label
// (Glucophage ⚠ vs aspirin ⓘ). Three-up via ClinicalSummaryTriptych.

export interface SummaryItem {
  id: string
  label: string
  severity?: "info" | "alert"
  meta?: string
  onClick?(): void
}

export function ClinicalSummaryColumn({
  title,
  items,
  reviewedAt,
  onReattest,
  onAdd,
  loading = false,
  className,
}: {
  title: string
  items: SummaryItem[]
  /** ISO date of the last attestation — a control, not a stamp. */
  reviewedAt?: string
  onReattest?(): void
  onAdd?(): void
  loading?: boolean
  className?: string
}) {
  const { t, i18n } = useTranslation()
  const reviewed = reviewedAt
    ? new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(reviewedAt))
    : undefined

  return (
    <section data-slot="clinical-summary-column" className={cn("flex flex-col overflow-hidden rounded-md border border-things-hairline bg-card", className)}>
      <header className="flex items-center justify-between gap-2 border-b border-things-hairline px-2.5 py-1.5">
        <h3 className="text-[13px] font-semibold tracking-tight text-things-title">{title}</h3>
        <div className="flex items-center gap-1">
          {reviewedAt && (
            <button
              type="button"
              onClick={onReattest}
              className="clinic-num rounded-sm px-1 text-[11px] text-things-gray-3 underline decoration-dotted hover:bg-things-hover hover:text-things-gray-2"
              title={t("clinic.summary.reattestHint")}
            >
              {t("clinic.summary.reviewed", { date: reviewed })}
            </button>
          )}
          {onAdd && (
            <Button variant="ghost" size="icon-xs" aria-label={t("clinic.summary.add")} onClick={onAdd}>
              <Plus aria-hidden="true" />
            </Button>
          )}
        </div>
      </header>

      {loading ? (
        <p className="px-3 py-8 text-center text-sm text-things-gray-3">{t("clinic.table.loading")}</p>
      ) : items.length === 0 ? (
        <p className="px-3 py-8 text-center text-sm text-things-gray-3">{t("clinic.table.empty")}</p>
      ) : (
        <ul>
          {items.map((it) => {
            const alert = it.severity === "alert"
            return (
              <li key={it.id}>
                <button
                  type="button"
                  onClick={it.onClick}
                  className={cn(
                    "flex w-full items-baseline gap-1.5 border-b border-clinic-grid-line px-2.5 py-1.5 text-left last:border-b-0",
                    it.onClick ? "hover:bg-things-hover" : "cursor-default",
                  )}
                >
                  {alert ? (
                    <OctagonAlert className="size-3.5 shrink-0 self-center text-clinic-critical" aria-hidden="true" />
                  ) : (
                    <span className="size-1.5 shrink-0 self-center rounded-full bg-things-blue" aria-hidden="true" />
                  )}
                  <span className={cn("truncate text-sm", alert ? "font-medium text-clinic-critical" : "text-things-title")}>{it.label}</span>
                  {it.meta && <span className="ml-auto shrink-0 text-[11px] text-things-gray-3">{it.meta}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

/** Chart-overview / exam-room three-up (grid md:grid-cols-3). */
export function ClinicalSummaryTriptych({ columns, className }: { columns: Array<React.ComponentProps<typeof ClinicalSummaryColumn>>; className?: string }) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-3", className)}>
      {columns.map((c, i) => (
        <ClinicalSummaryColumn key={c.title ?? i} {...c} />
      ))}
    </div>
  )
}
