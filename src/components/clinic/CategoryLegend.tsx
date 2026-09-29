import { Layers } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// CategoryLegend — a legend that filters (04, Layer 5; an open-source EMR category tree,
// a timeline tool). Swatches are 10px squares, not dots — squares read better for
// lanes. The `popover` variant is the compact/mobile form behind a
// "Layers (N)" trigger.

export function CategoryLegend({
  categories,
  value,
  onChange,
  variant = "panel",
  className,
}: {
  categories: Array<{ id: string; label: string; color: string; count?: number }>
  /** Visible category ids. */
  value: string[]
  onChange?: (v: string[]) => void
  variant?: "panel" | "popover"
  className?: string
}) {
  const { t } = useTranslation()

  const list = (
    <ul className={cn("flex flex-col gap-1.5", variant === "popover" && "gap-1")} role="group" aria-label={t("clinic.legend.label")}>
      {categories.map((c) => {
        const checked = value.includes(c.id)
        return (
          <li key={c.id}>
            <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-things-gray-2">
              <Checkbox
                checked={checked}
                disabled={!onChange}
                onCheckedChange={() =>
                  onChange?.(checked ? value.filter((v) => v !== c.id) : [...value, c.id])
                }
                aria-label={c.label}
                className="size-3"
                style={{ "--checkbox-color": c.color } as React.CSSProperties}
              />
              <span className="size-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: c.color }} aria-hidden="true" />
              <span className={cn("truncate", !checked && "text-things-gray-3 line-through")}>{c.label}</span>
              {c.count !== undefined && <span className="clinic-num ml-auto text-[11px] text-things-gray-3">{c.count}</span>}
            </label>
          </li>
        )
      })}
    </ul>
  )

  if (variant === "popover") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
            <Layers className="size-3.5" aria-hidden="true" />
            {t("clinic.legend.layers", { count: value.length })}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48 p-2">
          {list}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div data-slot="category-legend" className={className}>
      {list}
    </div>
  )
}
