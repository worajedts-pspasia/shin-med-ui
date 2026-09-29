import { Printer } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ReportFrame — three report types, one frame (04, Layer 8): title + Print +
// period dropdown, a chart canvas, and a config rail (calendar, RangeToggle,
// SeriesToggle…) that wraps below the canvas under lg.

export function ReportFrame({
  title,
  meta,
  periods,
  period,
  onPeriod,
  onPrint,
  config,
  children,
  className,
}: {
  title: string
  meta?: string
  periods?: { id: string; label: string }[]
  period?: string
  onPeriod?: (id: string) => void
  onPrint?: () => void
  /** Config rail content — compose RangeToggle / SeriesToggle / MiniCalendar here. */
  config?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <section
      data-slot="report-frame"
      className={cn("overflow-hidden rounded-md border border-things-hairline bg-card", className)}
    >
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-things-hairline px-4 py-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-things-title">{title}</h3>
          {meta && <p className="clinic-num text-xs text-things-gray-2">{meta}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {periods && periods.length > 0 && (
            <Select value={period} onValueChange={onPeriod}>
              <SelectTrigger size="sm" className="w-40" aria-label={t("clinic.ops.period")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periods.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" size="sm" onClick={onPrint ?? (() => window.print())}>
            <Printer className="size-3.5" aria-hidden="true" />
            {t("clinic.ops.print")}
          </Button>
        </div>
      </header>
      <div className="flex flex-col lg:flex-row">
        {/* Canvas first so the config rail wraps below it under lg */}
        <div data-slot="report-canvas" className="min-w-0 flex-1 p-4">
          {children}
        </div>
        {config && (
          <aside
            data-slot="report-config"
            aria-label={t("clinic.ops.config")}
            className="w-full shrink-0 space-y-4 border-t border-things-hairline p-3 lg:w-60 lg:border-l lg:border-t-0"
          >
            {config}
          </aside>
        )}
      </div>
    </section>
  )
}
