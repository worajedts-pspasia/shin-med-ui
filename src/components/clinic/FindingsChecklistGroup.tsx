import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { NativeSelect } from "@/components/ui/native-select"

// FindingsChecklistGroup — checkbox group with an "All Normal" master
// (04, Layer 6; the foot exam, the HPI group). "All Normal" sets every item
// to its normal value in one click — the biggest time-saver in clinical
// documentation. Marking an item abnormal reveals its Abnx select inline.
// Checkbox hit areas never shrink below 24px; columns collapse below md.

export interface FindingItem {
  id: string
  label: string
  checked: boolean
  abnormal?: string
  options?: string[]
}

export function FindingsChecklistGroup({
  title,
  items,
  allNormalLabel,
  onToggle,
  onAbnormal,
  columns = 2,
  className,
}: {
  title: string
  items: FindingItem[]
  allNormalLabel?: string
  onToggle: (id: string, checked: boolean) => void
  onAbnormal?: (id: string, value: string) => void
  columns?: 1 | 2 | 3
  className?: string
}) {
  const { t } = useTranslation()
  const GRID = { 1: "grid-cols-1", 2: "grid-cols-1 md:grid-cols-2", 3: "grid-cols-1 md:grid-cols-3" } as const

  return (
    <fieldset data-slot="findings-checklist" className={cn("flex flex-col gap-2", className)}>
      <legend className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-things-gray-2">{title}</legend>
      <label className="flex min-h-6 cursor-pointer select-none items-center gap-2 rounded-sm border border-things-tag-border bg-things-chip px-2 py-0.5 text-xs font-medium text-things-gray-2 hover:bg-things-hover">
        <Checkbox
          checked={items.every((i) => i.checked)}
          onCheckedChange={(v) => items.forEach((i) => onToggle(i.id, Boolean(v)))}
          aria-label={allNormalLabel ?? t("clinic.findings.allNormal")}
        />
        {allNormalLabel ?? t("clinic.findings.allNormal")}
      </label>
      <div className={cn("grid gap-x-4 gap-y-1", GRID[columns])}>
        {items.map((it) => (
          <div key={it.id} className="flex min-h-6 flex-wrap items-center gap-2">
            <label className="flex min-h-6 flex-1 cursor-pointer select-none items-center gap-2 text-sm text-things-title">
              <Checkbox checked={it.checked} onCheckedChange={(v) => onToggle(it.id, Boolean(v))} />
              <span className={cn(it.checked && "text-things-gray-3 line-through")}>{it.label}</span>
            </label>
            {it.options && it.options.length > 0 && (
              <NativeSelect
                aria-label={`${it.label} — ${t("clinic.findings.abnx")}`}
                value={it.abnormal ?? ""}
                onChange={(e) => onAbnormal?.(it.id, e.target.value)}
                className="h-6 w-auto max-w-32 py-0 text-xs"
              >
                <option value="">{t("clinic.findings.abnx")}</option>
                {it.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </NativeSelect>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  )
}
