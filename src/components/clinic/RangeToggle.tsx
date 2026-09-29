import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// RangeToggle — 3m · 6m · 1y · 2y · All (04, Layer 5). Trivial on purpose;
// three components share it (TrendChart, FlowsheetGrid, MedicationTimeline).

export type RangeId = "3m" | "6m" | "1y" | "2y" | "all" | (string & {})

export function RangeToggle({
  options,
  value,
  onChange,
  className,
}: {
  options: RangeId[]
  value?: RangeId
  onChange?: (r: RangeId) => void
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => {
        if (v) onChange?.(v)
      }}
      variant="outline"
      size="sm"
      className={cn("gap-0", className)}
      aria-label={t("clinic.trend.range")}
    >
      {options.map((o) => (
        <ToggleGroupItem key={o} value={o} className="px-2.5 py-0.5 text-xs">
          {t(`clinic.range.${o}`, { defaultValue: RANGE_LABEL[o] ?? String(o) })}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

const RANGE_LABEL: Record<string, string> = {
  "3m": "3m",
  "6m": "6m",
  "1y": "1y",
  "2y": "2y",
  all: "All",
}
