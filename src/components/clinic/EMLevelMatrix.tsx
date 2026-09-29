import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

// EMLevelMatrix — E/M coding engine (04, Layer 9): a 5×5 selectable decision
// grid plus a LevelMeter. Desktop-only; below md the meter and a note carry
// the state. Coding rules are jurisdiction-specific — the level function is
// min(problem, risk), swap in your payer's rule.

export function LevelMeter({ level, max = 5 }: { level: number; max?: number }) {
  const { t } = useTranslation()
  return (
    <div
      data-slot="level-meter"
      role="meter"
      aria-valuenow={level}
      aria-valuemin={1}
      aria-valuemax={max}
      aria-label={t("clinic.em.level")}
      className="flex items-center gap-1"
    >
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-2.5 flex-1 rounded-full",
            i < level ? "bg-things-blue" : "bg-things-hover",
          )}
        />
      ))}
      <span className="clinic-num ml-2 shrink-0 text-sm font-semibold text-things-title">
        {level}/{max}
      </span>
    </div>
  )
}

export function EMLevelMatrix({
  rowLabels,
  colLabels,
  selected,
  onSelect,
  className,
}: {
  /** Problem axis, 5 entries. */
  rowLabels: string[]
  /** Risk axis, 5 entries. */
  colLabels: string[]
  selected?: { row: number; col: number }
  onSelect?: (cell: { row: number; col: number; level: number }) => void
  className?: string
}) {
  const { t } = useTranslation()
  const levelAt = (row: number, col: number) => Math.min(row + 1, col + 1)
  const activeLevel = selected ? levelAt(selected.row, selected.col) : 0

  return (
    <div
      data-slot="em-level-matrix"
      className={cn("overflow-hidden rounded-md border border-things-hairline bg-card", className)}
    >
      {/* <md: desktop-only surface — meter + note carry the state */}
      <div className="space-y-2 p-3 md:hidden">
        <p className="text-xs text-things-gray-3">{t("clinic.em.desktopOnly")}</p>
        <LevelMeter level={activeLevel} />
      </div>

      <div className="hidden md:block">
        <div className="grid" style={{ gridTemplateColumns: `minmax(11rem, 1.4fr) repeat(${colLabels.length}, minmax(6rem, 1fr))` }}>
          <div />{/* corner */}
          {colLabels.map((label) => (
            <div key={label} className="border-b border-l border-things-hairline bg-things-sidebar/50 px-2 py-2 text-center text-xs font-medium text-things-gray-2">
              {label}
            </div>
          ))}
          {rowLabels.map((rowLabel, r) => (
            <div key={rowLabel} className="contents">
              <div className="border-b border-things-hairline px-3 py-2 text-xs font-medium text-things-title">
                {rowLabel}
              </div>
              {colLabels.map((colLabel, c) => {
                const on = selected?.row === r && selected?.col === c
                return (
                  <button
                    key={colLabel}
                    type="button"
                    data-cell={`${r}-${c}`}
                    data-level={levelAt(r, c)}
                    aria-pressed={on}
                    aria-label={`${rowLabel} × ${colLabel} → ${t("clinic.em.level")} ${levelAt(r, c)}`}
                    onClick={() => onSelect?.({ row: r, col: c, level: levelAt(r, c) })}
                    className={cn(
                      "clinic-num m-1 rounded-sm border py-2 text-sm font-medium transition-colors",
                      on
                        ? "border-things-blue bg-things-select text-things-blue"
                        : "border-things-hairline text-things-title hover:border-things-blue/50 hover:bg-things-hover",
                    )}
                  >
                    {levelAt(r, c)}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
        {selected && (
          <div className="border-t border-things-hairline p-3">
            <LevelMeter level={activeLevel} />
          </div>
        )}
      </div>
    </div>
  )
}
