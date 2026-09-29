import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export type CalloutTone = "today" | "warn" | "info"
export type CalloutPosition = "inline" | "top-right" | "top-center" | "bottom-right" | "bottom-left"

const TONE: Record<CalloutTone, { box: string; meta: string }> = {
  today: { box: "border-l-things-gold-dark bg-clinic-today", meta: "text-clinic-warn" },
  warn: { box: "border-l-clinic-warn bg-clinic-warn-soft", meta: "text-clinic-warn" },
  info: { box: "border-l-things-blue bg-things-blue-soft", meta: "text-things-blue" },
}

const POSITION: Record<CalloutPosition, string> = {
  inline: "",
  "top-right": "fixed right-4 top-4 z-50 max-w-[340px]",
  "top-center": "fixed left-1/2 top-4 z-50 max-w-[340px] -translate-x-1/2",
  "bottom-right": "fixed bottom-4 right-4 z-50 max-w-[340px]",
  "bottom-left": "fixed bottom-4 left-4 z-50 max-w-[340px]",
}

/** A note pinned by a person, on purpose — the layer between the banner
 *  (transient, system) and the note history log (append-only). Tone carries
 *  intent, the provenance line carries author and date, and both position
 *  and dismiss timeout are settable — sticky inline is the default. */
export function CalloutNote({
  tone = "today",
  position = "inline",
  /** Auto-dismiss after this many ms. 0 (default) = sticky, × only. */
  dismissAfter = 0,
  meta,
  onDismiss,
  children,
  className,
}: {
  tone?: CalloutTone
  position?: CalloutPosition
  dismissAfter?: number
  meta?: string
  onDismiss?: () => void
  children: React.ReactNode
  className?: string
}) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissAfter <= 0) return
    const t = setTimeout(() => {
      onDismiss?.()
      setDismissed(true)
    }, dismissAfter)
    return () => clearTimeout(t)
  }, [dismissAfter, onDismiss])

  if (dismissed) return null

  const dismiss = () => {
    onDismiss?.()
    setDismissed(true)
  }

  return (
    <div
      role="note"
      className={cn(
        "rounded-r-md rounded-l-sm border-l-[3px] px-3 py-2 text-[13px] text-things-ink-strong",
        TONE[tone].box,
        position !== "inline" && "shadow-lg",
        POSITION[position],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>{children}</div>
        {(dismissAfter > 0 || onDismiss) && (
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="shrink-0 opacity-60 hover:opacity-100"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
      {meta && <div className={cn("clinic-num mt-0.5 text-[11px]", TONE[tone].meta)}>{meta}</div>}
    </div>
  )
}
