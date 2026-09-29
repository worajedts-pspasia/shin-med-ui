import type { LucideIcon } from "lucide-react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

// StepTabs — numbered wizard step tabs (04, Layer 1; 1 Receipt · 2 Claim · …
// · 6 Print Queue). Completed steps get a green check (clinic-ok — the one
// semantic it may use); future steps are muted; the active step is the blue
// accent. Horizontal scroll below md.

export function StepTabs({
  steps,
  activeId,
  onSelect,
  completedIds = [],
  className,
}: {
  steps: Array<{ id: string; label: string; icon?: LucideIcon }>
  activeId: string
  onSelect: (id: string) => void
  completedIds?: string[]
  className?: string
}) {
  const done = new Set(completedIds)
  return (
    <div
      data-slot="step-tabs"
      role="tablist"
      className={cn("flex items-center gap-1 overflow-x-auto border-b border-things-hairline pb-px", className)}
    >
      {steps.map((s, i) => {
        const Icon = s.icon
        const active = s.id === activeId
        const complete = done.has(s.id) && !active
        return (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(s.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 border-b-2 px-2.5 py-1.5 text-xs transition-colors",
              active
                ? "border-things-blue font-medium text-things-blue"
                : complete
                  ? "border-transparent text-clinic-ok"
                  : "border-transparent text-things-gray-3 hover:text-things-gray-2",
            )}
          >
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded-full text-[10px] font-semibold",
                active
                  ? "bg-things-blue text-white"
                  : complete
                    ? "bg-clinic-ok/10 text-clinic-ok"
                    : "border border-things-box text-things-gray-3",
              )}
            >
              {complete ? <Check className="size-3" aria-hidden="true" /> : i + 1}
            </span>
            {Icon && <Icon className="size-3.5" aria-hidden="true" />}
            {s.label}
          </button>
        )
      })}
    </div>
  )
}
