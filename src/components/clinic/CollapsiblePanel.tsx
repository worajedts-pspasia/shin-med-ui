import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Check, TriangleAlert, OctagonAlert } from "lucide-react"
import type { Tone } from "./types"

const STATUS_ICON = {
  none: null,
  ok: { icon: Check, cls: "text-clinic-ok" },
  warn: { icon: TriangleAlert, cls: "text-clinic-warn" },
  critical: { icon: OctagonAlert, cls: "text-clinic-critical" },
} as const

/** The universal titled, collapsible panel (04, Layer 1). Three variants:
 * panel (rail) · section (workspace) · inline (nested inside a card). Open
 * state persists per title key. */
export function CollapsiblePanel({
  title,
  action,
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  variant = "panel",
  status = "none",
  children,
  className,
}: {
  title: React.ReactNode
  action?: React.ReactNode
  defaultOpen?: boolean
  /** Controlled open state — PanelStack's accordion mode injects it. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: "panel" | "section" | "inline"
  status?: Tone
  children: React.ReactNode
  className?: string
}) {
  const [openState, setOpenState] = useState(defaultOpen)
  const open = openProp ?? openState
  const setOpen = (v: boolean) => {
    setOpenState(v)
    onOpenChange?.(v)
  }
  const s = STATUS_ICON[status]
  return (
    <section
      className={cn(
        "rounded-md",
        variant === "panel" && "bg-card",
        variant === "section" && "border border-things-hairline",
        variant === "inline" && "rounded-md border border-things-hairline",
        className,
      )}
      data-open={open}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-1.5 text-left",
          variant === "panel" && "px-3 py-2",
          variant === "section" && "px-3 py-2",
          variant === "inline" && "px-2.5 py-1.5",
        )}
      >
        <ChevronRight
          className={cn("size-3.5 shrink-0 text-things-gray transition-transform", open && "rotate-90")}
          aria-hidden="true"
        />
        <span
          className={cn(
            "min-w-0 flex-1 truncate font-semibold text-things-title",
            variant === "inline" ? "text-[11px] uppercase tracking-wide" : "text-[13px]",
          )}
        >
          {title}
        </span>
        {s && <s.icon className={cn("size-3.5 shrink-0", s.cls)} aria-hidden="true" />}
        {action && <span className="shrink-0" onClick={(e) => e.stopPropagation()}>{action}</span>}
      </button>
      {open && (
        <div className={cn(variant === "panel" || variant === "section" ? "px-3 pb-3" : "px-2.5 pb-2.5")}>{children}</div>
      )}
    </section>
  )
}
