import type { LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

// EventDetailPopover — anchored key-value detail on an event (04, Layer 5;
// an open-source EMR's balloon: substance, ATC, regimen, aim, episode, revision). This is
// the content body: a title row (lane icon + date) + a dl grid. Consumers
// anchor it — EventTimeline uses a Popover above sm and a bottom Sheet below
// (06 §1 Breakpoint-swap), which is why the body is separate.

export function EventDetailPopover({
  title,
  at,
  laneLabel,
  laneIcon: LaneIcon,
  detail,
  actions,
  className,
}: {
  title: string
  at: string
  laneLabel?: string
  laneIcon?: LucideIcon
  detail?: Array<{ label: string; value: string }>
  actions?: React.ReactNode
  className?: string
}) {
  const { t, i18n } = useTranslation()
  const dateLabel = new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeStyle: "short" }).format(new Date(at))
  return (
    <div data-slot="event-detail-popover" className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-2">
        {LaneIcon && <LaneIcon className="size-4 shrink-0 text-things-gray-2" aria-hidden="true" />}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-things-title">{title}</p>
          <p className="clinic-num text-xs text-things-gray-3">
            {dateLabel}
            {laneLabel && <span className="ml-1.5 font-sans">· {laneLabel}</span>}
          </p>
        </div>
      </div>

      {detail && detail.length > 0 ? (
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          {detail.map((d) => (
            <div key={d.label} className="col-span-2 grid grid-cols-subgrid">
              <dt className="text-xs text-things-gray-3">{d.label}</dt>
              <dd className="clinic-num break-words text-sm text-things-ink">{d.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-xs text-things-gray-3">{t("clinic.timeline.noDetail")}</p>
      )}

      {actions && <div className="flex flex-wrap justify-end gap-2 border-t border-things-hairline pt-2">{actions}</div>}
    </div>
  )
}
