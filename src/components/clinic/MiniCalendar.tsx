import * as React from "react"
import { useTranslation } from "react-i18next"
import { enUS, ja as jaLocale, th as thLocale } from "react-day-picker/locale"
import type { Locale } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import type { DayButton } from "react-day-picker"

// MiniCalendar — month picker with density markers (04, Layer 3; WinForms EMR left
// rail). Today renders on clinic-today. Days with appointments get a density
// dot UNDER the number — size encodes the level, colour stays gold
// (appointments category), so density never borrows a severity hue.

export type MarkerLevel = 1 | 2 | 3

export interface MiniCalendarProps {
  /** ISO date (yyyy-mm-dd) of the selected day. */
  selected?: string
  onSelect?: (iso: string) => void
  /** The month shown (ISO yyyy-mm); defaults to the selected month. */
  month?: string
  /** ISO date → density marker. */
  markers?: Record<string, { count: number; level?: MarkerLevel }>
  className?: string
}

const toIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

const fromIso = (iso: string) => new Date(`${iso}T00:00:00`)

const RDP_LOCALE: Record<string, Locale> = { en: enUS, th: thLocale, ja: jaLocale }

// size encodes density — a non-colour channel, like every severity rule
const LEVEL_DOT: Record<MarkerLevel, string> = {
  1: "size-1",
  2: "size-1.5",
  3: "size-2",
}

export function MiniCalendar({ selected, onSelect, month, markers, className }: MiniCalendarProps) {
  const { t, i18n } = useTranslation()
  const selectedDate = selected ? fromIso(selected) : undefined

  const MarkerDayButton = React.useCallback(function MarkerDayButton({
    className,
    children,
    ...props
  }: React.ComponentProps<typeof DayButton>) {
    const iso = toIso(props.day.date)
    const marker = markers?.[iso]
    return (
      <Button variant="ghost" size="icon" className={cn("relative", className)} {...props}>
        {children}
        {marker && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute bottom-0.5 left-1/2 -translate-x-1/2 rounded-full bg-things-gold",
              LEVEL_DOT[marker.level ?? 2],
            )}
          />
        )}
      </Button>
    )
  }, [markers])

  return (
    <div data-slot="mini-calendar" className={cn("text-sm", className)}>
      <Calendar
        mode="single"
        locale={RDP_LOCALE[i18n.language] ?? enUS}
        selected={selectedDate}
        month={month ? fromIso(`${month}-01`) : undefined}
        onSelect={(_, triggerDate) => {
          const d = triggerDate ?? selectedDate
          if (d && onSelect) onSelect(toIso(d))
        }}
        classNames={{
          // today = clinic-today (03 §3), re-asserting the defaults we replace
          today: "rounded-md bg-clinic-today text-things-title data-[selected=true]:rounded-none",
        }}
        components={{ DayButton: MarkerDayButton }}
        aria-label={t("clinic.cal.label")}
      />
    </div>
  )
}
