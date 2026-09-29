import { Star, TriangleAlert, FileText, HeartPulse } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { PatientName } from "./PatientName"
import { PatientAge } from "./PatientAge"
import type { PatientIdentity } from "./types"

export type PatientAlert = { kind: "allergy" | "flag" | "advance-directive"; label: string }

const ALERT_ICON = { allergy: TriangleAlert, flag: HeartPulse, "advance-directive": FileText } as const

/** The identity banner that never scrolls away (04, Layer 2). Sticky in every
 * layout including mobile; compact mode drops the secondary line but NEVER the
 * MRN or DOB — two-identifier verification is the standard. */
export function PatientHeaderBar({
  patient,
  asOf,
  alerts = [],
  nextAppointment,
  favorite,
  onToggleFavorite,
  actions,
  compact = false,
  className,
}: {
  patient: PatientIdentity
  asOf?: string
  alerts?: PatientAlert[]
  nextAppointment?: { date: string; time?: string; with?: string }
  favorite?: boolean
  onToggleFavorite?(): void
  actions?: React.ReactNode
  compact?: boolean
  className?: string
}) {
  const { t, i18n } = useTranslation()
  const initials = `${patient.name.given.charAt(0)}${patient.name.family.charAt(0)}`
  const dobFmt = new Intl.DateTimeFormat(
    i18n.language === "th" ? "th-TH-u-ca-buddhist" : i18n.language === "ja" ? "ja-JP" : "en-US",
    { year: "numeric", month: "short", day: "numeric" },
  ).format(new Date(patient.dob + "T00:00:00"))

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-things-hairline bg-card px-3 py-2",
        compact ? "min-h-[44px]" : "min-h-[56px]",
        className,
      )}
      data-patient-bar=""
    >
      <Avatar className="size-9">
        <AvatarFallback className="bg-things-chip text-xs font-semibold text-things-ink">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-2">
          <PatientName parts={patient.name} className="text-base font-semibold" />
          {onToggleFavorite && (
            <button
              type="button"
              aria-label="Toggle favorite"
              onClick={onToggleFavorite}
              className={cn("transition-colors", favorite ? "text-things-gold" : "text-things-gray-3 hover:text-things-gold")}
            >
              <Star className="size-4" fill={favorite ? "currentColor" : "none"} strokeWidth={1.8} />
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-things-gray-3">
          <PatientAge dob={patient.dob} asOf={asOf} />
          <span aria-hidden="true">·</span>
          <span>{t(`clinic.patient.sexLabel.${patient.sex}`)}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-[11px]">{patient.mrn}</span>
          {!compact && (
            <>
              <span aria-hidden="true">·</span>
              <span className="clinic-num">{t("clinic.patient.dob")} {dobFmt}</span>
            </>
          )}
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="flex items-center gap-1" aria-label={t("clinic.patient.alerts")}>
          {alerts.map((a) => {
            const Icon = ALERT_ICON[a.kind]
            return (
              <HoverCard key={a.kind + a.label}>
                <HoverCardTrigger asChild>
                  <button
                    type="button"
                    aria-label={a.label}
                    className="flex size-7 items-center justify-center rounded-md text-clinic-critical transition-colors hover:bg-clinic-critical-soft"
                  >
                    <Icon className="size-4" strokeWidth={2.2} />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-56 text-xs text-things-ink">{a.label}</HoverCardContent>
              </HoverCard>
            )
          })}
        </div>
      )}

      {nextAppointment && (
        <span className="ml-auto hidden items-center gap-1 rounded-full bg-things-chip-soft px-2 py-0.5 text-[11px] text-things-gray-2 sm:inline-flex">
          <span className="clinic-num">{nextAppointment.date}</span>
          {nextAppointment.time && <span className="clinic-num">{nextAppointment.time}</span>}
          {nextAppointment.with && <span>· {nextAppointment.with}</span>}
        </span>
      )}

      {actions && <div className="ml-auto flex items-center gap-1">{actions}</div>}
    </header>
  )
}
