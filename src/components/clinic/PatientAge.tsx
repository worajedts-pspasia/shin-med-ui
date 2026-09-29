import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

function diffDays(from: Date, to: Date): { years: number; months: number; days: number } {
  let years = to.getFullYear() - from.getFullYear()
  let months = to.getMonth() - from.getMonth()
  let days = to.getDate() - from.getDate()
  if (days < 0) {
    months -= 1
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }
  return { years, months, days }
}

/** Composite age (04, Layer 2): `< 2y` → months+days, `< 18y` → years+months,
 * else years. Paediatric dosing depends on this — never a bare year count. */
export function PatientAge({
  dob,
  asOf,
  precision = "auto",
  className,
}: {
  dob: string
  asOf?: string
  precision?: "auto" | "y" | "ym" | "ymd"
  className?: string
}) {
  const { t } = useTranslation()
  const to = asOf ? new Date(asOf + "T00:00:00") : new Date()
  const { years, months, days } = diffDays(new Date(dob + "T00:00:00"), to)

  const mode =
    precision !== "auto" ? precision : years < 2 ? "ymd" : years < 18 ? "ym" : "y"

  const parts: string[] = []
  if (mode === "ymd" || mode === "ym" || mode === "y") parts.push(`${years}${t("clinic.age.y")}`)
  if (mode === "ymd" || mode === "ym") parts.push(`${months}${t("clinic.age.m")}`)
  if (mode === "ymd") parts.push(`${days}${t("clinic.age.d")}`)

  return (
    <span className={cn("clinic-num text-things-gray-3", className)} title={dob}>
      {parts.join(" ")}
    </span>
  )
}
