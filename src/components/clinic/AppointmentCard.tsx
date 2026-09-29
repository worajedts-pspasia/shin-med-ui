import type { LucideIcon } from "lucide-react"
import { BadgeCheck, Calendar, CheckCheck, CircleOff, LogIn, MoreVertical, Stethoscope } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PatientName } from "./PatientName"
import type { NameParts } from "./types"

// AppointmentCard — one appointment (04, Layer 3): the closest thing in the
// sources to an existing Things component, treated as a clinical TaskRow.
// Status is a glyph + text, never a colour fill — colour belongs to the
// appointment TYPE on the schedule grid (05 §2). Selected = things-blue-soft
// with a things-blue left edge. Below sm the time range moves under the name.

export type ApptStatus = "scheduled" | "confirmed" | "checked-in" | "in-room" | "checked-out" | "no-show"

/** Shared with ScheduleGrid blocks — status is a glyph, never a fill. */
export const STATUS_GLYPH: Record<ApptStatus, { icon: LucideIcon }> = {
  scheduled: { icon: Calendar },
  confirmed: { icon: BadgeCheck },
  "checked-in": { icon: LogIn },
  "in-room": { icon: Stethoscope },
  "checked-out": { icon: CheckCheck },
  "no-show": { icon: CircleOff },
}

export interface AppointmentCardProps {
  appt: {
    id: string
    patient: { name: NameParts; age?: string; sex?: "male" | "female" }
    start: string
    end?: string
    type: string
    reason?: string
    location?: string
    status: ApptStatus
  }
  selected?: boolean
  /** Context-menu actions (right-click); also exposed via the ⋯ button. */
  actions?: Array<{ id: string; label: string; onSelect: () => void; destructive?: boolean }>
  onSelect?: () => void
  className?: string
}

export function AppointmentCard({ appt, selected = false, actions, onSelect, className }: AppointmentCardProps) {
  const { t } = useTranslation()
  const { patient, start, end, type, reason, location, status } = appt
  const Glyph = STATUS_GLYPH[status].icon

  const card = (
    <Card
      data-slot="appointment-card"
      data-status={status}
      data-selected={selected ? "" : undefined}
      onClick={onSelect}
      className={cn(
        "border-l-2 border-things-hairline gap-0 py-2.5 pr-2 shadow-none transition-colors",
        // both states keep border-l-2 so selecting never shifts the card;
        // unselected shows the hairline (not a transparent gap) on the left
        selected && "border-l-things-blue bg-things-blue-soft",
        onSelect && "cursor-pointer hover:bg-things-hover",
        className,
      )}
    >
      <div className="flex flex-col gap-1.5 px-3 sm:flex-row sm:items-start sm:gap-4">
        {/* info first in the a11y tree; below sm the time moves under the name */}
        <div className="order-1 min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
              <PatientName parts={patient.name} className="truncate text-sm font-medium text-things-title" />
              {patient.age && <span className="clinic-num text-xs text-things-gray-3">{patient.age}</span>}
              {patient.sex && <span className="text-xs text-things-gray-3">{t(`clinic.patient.sexLabel.${patient.sex}`)}</span>}
            </div>
            {actions && actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={t("clinic.appt.actions")}
                    className="-mr-1 shrink-0 text-things-gray-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  {actions.map((a, i) => (
                    <span key={a.id}>
                      {a.destructive && i > 0 && <DropdownMenuSeparator />}
                      <DropdownMenuItem
                        className={a.destructive ? "text-clinic-critical focus:text-clinic-critical" : undefined}
                        onSelect={a.onSelect}
                      >
                        {a.label}
                      </DropdownMenuItem>
                    </span>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-things-gray-3">
            <span className="text-things-gray-2">{type}</span>
            {location && <span>{location}</span>}
            {reason && <span className="truncate">{reason}</span>}
          </p>
        </div>
        <div className="order-2 flex shrink-0 items-center gap-3 sm:order-1 sm:flex-col sm:items-end sm:gap-0.5">
          <span className="clinic-num flex items-baseline gap-1 text-sm font-medium text-things-title">
            {start}
            {end && <span className="text-xs font-normal text-things-gray-3">– {end}</span>}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-things-gray-2">
            <Glyph className="size-3" aria-hidden="true" />
            {t(`clinic.appt.status.${status}`)}
          </span>
        </div>
      </div>
    </Card>
  )

  if (!actions || actions.length === 0) return card
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{card}</ContextMenuTrigger>
      <ContextMenuContent>
        {actions.map((a, i) => (
          <span key={a.id}>
            {a.destructive && i > 0 && <ContextMenuSeparator />}
            <ContextMenuItem className={a.destructive ? "text-clinic-critical focus:text-clinic-critical" : undefined} onSelect={a.onSelect}>
              {a.label}
            </ContextMenuItem>
          </span>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  )
}
