import { intlTag } from "@/i18n"

/** Today header: "Monday, September 28" / th / ja equivalents. */
export function longDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(intlTag(locale), { weekday: "long", month: "long", day: "numeric" }).format(date)
}

/** Short date chip: localized "Today"/"Tomorrow", else "Sep 29"-style. */
export function shortDate(iso: string, locale: string, t: { today: string; tomorrow: string }): string {
  const date = new Date(iso + "T00:00:00")
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString()
  if (same(date, today)) return t.today
  if (same(date, tomorrow)) return t.tomorrow
  return new Intl.DateTimeFormat(intlTag(locale), { month: "short", day: "numeric" }).format(date)
}

/** Upcoming column: weekday short label. */
export function weekdayShort(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(intlTag(locale), { weekday: "short" }).format(date)
}

/** Upcoming month group label. */
export function monthLong(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(intlTag(locale), { month: "long" }).format(date)
}
