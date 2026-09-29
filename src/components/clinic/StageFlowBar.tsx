import { cn } from "@/lib/utils"

/** Chevron clip-paths — segments interlock; the first has no left notch. */
const CHEVRON = "polygon(0 0, calc(100% - 9px) 0, 100% 50%, calc(100% - 9px) 100%, 0 100%, 9px 50%)"
const CHEVRON_FIRST = "polygon(0 0, calc(100% - 9px) 0, 100% 50%, calc(100% - 9px) 100%, 0 100%)"

/** A subject's position in a fixed sequence of stages — a care pathway, a
 *  review flow, any ordered protocol — as chevron segments. Done stages
 *  carry their dwell duration; skipped stages are hatched and unclickable. */
export function StageFlowBar({
  stages,
  /** 1-based index of the current stage; stages before it are done. */
  current,
  /** 1-based indices of inactive (skipped) stages. */
  inactive = [],
  /** Duration unit label under each name — "days", "วัน". */
  unit = "days",
  /** Dwell counts keyed by 1-based stage number. Missing entries show "—". */
  durations = {},
  dense = false,
  onStageSelect,
  className,
}: {
  stages: string[]
  current: number
  inactive?: number[]
  unit?: string
  durations?: Record<number, number>
  dense?: boolean
  onStageSelect?: (stage: number) => void
  className?: string
}) {
  return (
    <div
      role="listbox"
      aria-label="Stages"
      className={cn("flex w-full", dense ? "text-[10px]" : "text-[11px]", className)}
    >
      {stages.map((name, i) => {
        const n = i + 1
        const isInactive = inactive.includes(n)
        const state = isInactive
          ? "inactive"
          : n < current
            ? "done"
            : n === current
              ? "current"
              : "pending"
        const days = isInactive || n > current ? "—" : `${durations[n] ?? 0} ${unit}`
        return (
          <button
            key={n}
            type="button"
            disabled={isInactive}
            onClick={() => onStageSelect?.(n)}
            aria-current={state === "current" ? "step" : undefined}
            style={{
              clipPath: i === 0 ? CHEVRON_FIRST : CHEVRON,
              ...(isInactive
                ? {
                    backgroundImage:
                      "repeating-linear-gradient(45deg, var(--color-things-select) 0 4px, var(--color-things-hover) 4px 8px)",
                  }
                : {}),
            }}
            className={cn(
              "flex min-w-0 flex-1 flex-col justify-center text-left",
              dense ? "h-8 pl-4 pr-3.5" : "h-9 pl-4.5 pr-3.5",
              i > 0 && "-ml-1.5",
              i === 0 && "rounded-l-md",
              state === "done" && "bg-clinic-ok text-white",
              state === "current" && "bg-things-blue text-white",
              state === "pending" && "bg-things-select text-things-gray-2",
              isInactive && "cursor-not-allowed text-things-gray",
              state !== "pending" && !isInactive && "cursor-pointer",
            )}
          >
            <span className="truncate text-[11px] font-semibold leading-tight">{name}</span>
            <span className="clinic-num text-[10px] leading-tight opacity-85">{days}</span>
          </button>
        )
      })}
    </div>
  )
}
