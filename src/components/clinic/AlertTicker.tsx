import { BellRing, CheckCheck } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// AlertTicker — solar alarm footer (04, Layer 8). Severity rows with counters
// and Ack Top / Ack All. Clinic use: critical labs, unsigned notes. ≥md the
// rows run as one horizontal ticker; below md they stack as banners.

export interface OpsAlert {
  id: string
  severity: "critical" | "warn"
  label: string
  count: number
  at: string
}

// Static maps — the JIT cannot see template-built classes.
const SEV = {
  critical: { chip: "bg-clinic-critical-soft text-clinic-critical", label: "clinic.ops.critical" },
  warn: { chip: "bg-clinic-warn-soft text-clinic-warn", label: "clinic.ops.warn" },
} as const

export function AlertTicker({
  alerts,
  onAck,
  onAckAll,
  className,
}: {
  alerts: OpsAlert[]
  onAck?: (id: string) => void
  onAckAll?: () => void
  className?: string
}) {
  const { t } = useTranslation()
  if (alerts.length === 0) {
    return (
      <div
        data-slot="alert-ticker"
        className={cn(
          "flex items-center gap-2 rounded-md border border-things-hairline bg-card px-3 py-2 text-sm text-things-gray-3",
          className,
        )}
      >
        <BellRing className="size-4" aria-hidden="true" />
        {t("clinic.ops.noAlerts")}
      </div>
    )
  }
  return (
    <div
      data-slot="alert-ticker"
      role="status"
      aria-label={t("clinic.ops.alerts")}
      className={cn("rounded-md border border-things-hairline bg-card", className)}
    >
      <div className="flex flex-col gap-1.5 p-2 md:flex-row md:items-center md:overflow-x-auto">
        <span className="hidden shrink-0 items-center gap-1.5 pl-1 text-xs font-medium text-things-gray-2 md:flex">
          <BellRing className="size-3.5" aria-hidden="true" />
          {t("clinic.ops.alerts")}
        </span>
        {alerts.map((a) => (
          <button
            key={a.id}
            type="button"
            data-alert={a.id}
            data-severity={a.severity}
            onClick={() => onAck?.(a.id)}
            title={t("clinic.ops.ackOne")}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-sm px-2 py-1 text-left text-xs transition-opacity hover:opacity-80",
              SEV[a.severity].chip,
            )}
          >
            <span className="font-semibold uppercase tracking-wide">{t(SEV[a.severity].label)}</span>
            <span className="min-w-0 truncate">{a.label}</span>
            <span className="clinic-num shrink-0 rounded-full bg-card/70 px-1.5 font-medium">{a.count}</span>
            <span className="clinic-num shrink-0 opacity-70">{a.at}</span>
          </button>
        ))}
        <span className="mt-1 flex shrink-0 items-center gap-2 md:ml-auto md:mt-0">
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => alerts[0] && onAck?.(alerts[0].id)}>
            {t("clinic.ops.ackTop")}
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onAckAll}>
            <CheckCheck className="size-3.5" aria-hidden="true" />
            {t("clinic.ops.ackAll")}
          </Button>
        </span>
      </div>
    </div>
  )
}
