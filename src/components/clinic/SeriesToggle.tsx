import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

// SeriesToggle — checkbox group bound to chart-series visibility (04,
// Layer 8, solar Report Configuration). Swatch squares, not dots: a series
// is a band of colour, and the swatch previews the stroke.

export function SeriesToggle({
  series,
  value,
  onChange,
  className,
}: {
  series: { id: string; label: string; color: string }[]
  /** Visible series ids; order follows `series`, not selection order. */
  value: string[]
  onChange?: (v: string[]) => void
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <fieldset
      data-slot="series-toggle"
      className={cn("space-y-1.5", className)}
      aria-label={t("clinic.ops.series")}
    >
      {series.map((s) => {
        const on = value.includes(s.id)
        return (
          <label
            key={s.id}
            className="flex cursor-pointer items-center gap-2.5 rounded-sm px-1 py-1 text-sm text-things-title hover:bg-things-hover"
          >
            <Checkbox
              checked={on}
              onCheckedChange={() =>
                onChange?.(on ? value.filter((v) => v !== s.id) : [...value, s.id])
              }
            />
            <span
              className="size-2.5 shrink-0 rounded-[2px] border border-things-hairline"
              style={{ backgroundColor: on ? s.color : "transparent" }}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate">{s.label}</span>
          </label>
        )
      })}
    </fieldset>
  )
}
