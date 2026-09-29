import { Check, TriangleAlert, OctagonAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Tone } from "./types"

const STATUS_ICON = {
  none: null,
  ok: { icon: Check, cls: "text-clinic-ok" },
  warn: { icon: TriangleAlert, cls: "text-clinic-warn" },
  critical: { icon: OctagonAlert, cls: "text-clinic-critical" },
} as const

/** Flat replacement for the gradient banner (04, Layer 1): hairline above,
 * 13px semibold title, optional right-aligned meta (the attestation line). */
export function SectionHeader({
  title,
  meta,
  action,
  status = "none",
  className,
}: {
  title: React.ReactNode
  meta?: React.ReactNode
  action?: React.ReactNode
  status?: Exclude<Tone, "none"> | "none"
  className?: string
}) {
  const s = STATUS_ICON[status]
  return (
    <div className={cn("flex items-center justify-between gap-3 border-t border-things-hairline pt-2", className)}>
      <div className="flex min-w-0 items-center gap-1.5">
        <h2 className="truncate text-[13px] font-semibold tracking-tight text-things-title">{title}</h2>
        {s && <s.icon className={cn("size-3.5 shrink-0", s.cls)} aria-hidden="true" />}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {meta && <span className="text-[11px] text-things-gray">{meta}</span>}
        {action}
      </div>
    </div>
  )
}
