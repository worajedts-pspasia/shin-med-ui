import { cn } from "@/lib/utils"
import type { LabFlag, Tone } from "./types"

/** A clinical value is never bare (docs/spec/04, Layer 4).
 * Renders `120 mg/dL` with the unit de-emphasised, tabular numerals, and an
 * optional abnormal tone on the value itself — the eye lands on the value. */
export function ValueWithUnit({
  value,
  unit,
  flag,
  range,
  tone,
  className,
}: {
  value: string | number | [string, string]
  unit?: string
  flag?: LabFlag
  range?: [string, string]
  tone?: Tone
  className?: string
}) {
  const text =
    tone === "critical"
      ? "text-clinic-critical"
      : tone === "warn"
        ? "text-clinic-warn"
        : tone === "ok"
          ? "text-clinic-ok"
          : "text-things-ink"
  const title = range ? `Reference: ${range[0]}–${range[1]}${unit ? ` ${unit}` : ""}` : undefined
  return (
    <span className={cn("inline-flex items-baseline gap-1", className)} title={title} data-numeric>
      <span className={cn("clinic-num text-sm font-medium", text)}>
        {Array.isArray(value) ? value.join(" / ") : value}
      </span>
      {unit && <span className="text-[11px] text-things-gray">{unit}</span>}
      {flag && flag !== "N" && <span className="text-[11px] font-semibold">{flag}</span>}
    </span>
  )
}
