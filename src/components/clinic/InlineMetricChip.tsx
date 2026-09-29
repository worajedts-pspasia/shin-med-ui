import { cn } from "@/lib/utils"
import { toneSoft, toneText } from "./tokens"
import type { Tone } from "./types"

// InlineMetricChip — a measured value as a tinted chip (04, Layer 6;
// cardiology "90% Pre-Intervention" / "0% Post-Intervention" / "TIMI 2").
// Tone is severity when it IS one; default neutral.

export function InlineMetricChip({
  value,
  label,
  tone = "none",
  unit,
  className,
}: {
  value: string
  label?: string
  tone?: Tone
  unit?: string
  className?: string
}) {
  const neutral = tone === "none"
  return (
    <span
      data-slot="inline-metric-chip"
      data-tone={tone}
      className={cn(
        "inline-flex max-w-full items-baseline gap-1.5 rounded-md px-2 py-0.5 text-xs",
        neutral ? "border border-things-tag-border bg-things-chip" : toneSoft[tone],
        className,
      )}
    >
      <span className={cn("clinic-num font-medium", neutral ? "text-things-title" : toneText[tone])}>
        {value}
        {unit && <span className="ml-0.5 font-normal">{unit}</span>}
      </span>
      {label && <span className="truncate text-things-gray-2">{label}</span>}
    </span>
  )
}
