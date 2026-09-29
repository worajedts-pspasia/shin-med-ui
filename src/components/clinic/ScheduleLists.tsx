import { ChevronDown, ChevronUp } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

// ScheduleLists — the two small scheduling companions (04, Layer 3).

// ——— ScheduleSummaryTable ———
// Six numbers that answer "how is today going". Clicking a cell filters the
// queue. Mine | Total × Scheduled / Checked-In / Checked-Out / No-Shows.

export interface SummaryRowDef {
  status: "scheduled" | "checked-in" | "checked-out" | "no-show"
  mine: number
  total: number
}

export function ScheduleSummaryTable({
  date,
  rows,
  onCell,
  className,
}: {
  date: string
  rows: SummaryRowDef[]
  onCell?(status: SummaryRowDef["status"], mine: boolean): void
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <table data-slot="schedule-summary" className={cn("w-full border-separate border-spacing-0 text-sm", className)}>
      <caption className="clinic-num mb-1 text-left text-[11px] uppercase tracking-wide text-things-gray-3">{date}</caption>
      <thead>
        <tr>
          <th scope="col" className="border-b border-clinic-grid-line pb-1 text-left text-[11px] font-semibold uppercase tracking-wide text-things-gray-2">
            {t("clinic.summary.status")}
          </th>
          <th scope="col" className="border-b border-clinic-grid-line pb-1 text-right text-[11px] font-semibold uppercase tracking-wide text-things-gray-2">
            {t("clinic.summary.mine")}
          </th>
          <th scope="col" className="border-b border-clinic-grid-line pb-1 text-right text-[11px] font-semibold uppercase tracking-wide text-things-gray-2">
            {t("clinic.summary.total")}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.status}>
            <th scope="row" className="border-b border-clinic-grid-line py-1 text-left font-normal text-things-title">
              {t(`clinic.summary.row.${r.status}`)}
            </th>
            {[r.mine, r.total].map((v, i) => (
              <td key={i} className="border-b border-clinic-grid-line py-1 text-right">
                <button
                  type="button"
                  onClick={() => onCell?.(r.status, i === 0)}
                  disabled={!onCell}
                  className={cn(
                    "clinic-num min-w-8 rounded-sm px-1.5 text-things-title tabular-nums",
                    onCell && "hover:bg-things-hover",
                    r.status === "no-show" && v > 0 && "text-clinic-warn",
                  )}
                >
                  {v}
                </button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ——— ResourceFilterList ———
// Checkbox list of providers / rooms; colour swatch matches the grid column;
// select-all / clear per group.

export interface ResourceGroup {
  id: string
  label: string
  items: Array<{ id: string; label: string; color?: string; count?: number }>
}

export function ResourceFilterList({
  groups,
  value,
  onChange,
  showColors = true,
  className,
}: {
  groups: ResourceGroup[]
  value: string[]
  onChange?(v: string[]): void
  showColors?: boolean
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <div data-slot="resource-filter-list" className={cn("flex flex-col gap-2", className)}>
      {groups.map((g) => {
        const ids = g.items.map((i) => i.id)
        const all = ids.every((id) => value.includes(id))
        return (
          <section key={g.id}>
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-wide text-things-gray-3">{g.label}</h4>
              {onChange && (
                <Button
                  variant="ghost"
                  size="xs"
                  className="h-5 px-1 text-[11px] text-things-gray-3"
                  aria-label={all ? t("clinic.resource.clear") : t("clinic.resource.selectAll")}
                  onClick={() => onChange(all ? value.filter((v) => !ids.includes(v)) : [...new Set([...value, ...ids])])}
                >
                  {all ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
                  {all ? t("clinic.resource.clear") : t("clinic.resource.selectAll")}
                </Button>
              )}
            </div>
            <ul>
              {g.items.map((it) => (
                <li key={it.id}>
                  <label className="flex min-h-7 cursor-pointer select-none items-center gap-2 rounded-sm px-1 text-sm">
                    <Checkbox
                      checked={value.includes(it.id)}
                      disabled={!onChange}
                      onCheckedChange={() =>
                        onChange?.(value.includes(it.id) ? value.filter((v) => v !== it.id) : [...value, it.id])
                      }
                      aria-label={it.label}
                    />
                    {showColors && it.color && <span className="size-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: it.color }} aria-hidden="true" />}
                    <span className={cn("min-w-0 flex-1 truncate", value.includes(it.id) ? "text-things-title" : "text-things-gray-3")}>{it.label}</span>
                    {it.count !== undefined && <span className="clinic-num text-[11px] text-things-gray-3">{it.count}</span>}
                  </label>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
