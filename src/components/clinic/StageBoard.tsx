import { useState } from "react"
import { cn } from "@/lib/utils"
import { BoardCard, type BoardCardData } from "./BoardCard"

export interface StageColumn {
  id: string
  name: string
  cards: BoardCardData[]
}

/** Columns of movable cards — one column per stage of a Stage Flow Bar.
 *  Each column header reports the card count and the column sum (money or
 *  any summable quantity, unit-prefixed), re-derived from data on every
 *  move — never from the DOM. */
export function StageBoard({
  columns,
  /** Prefix for column sums — "$", "฿", or "" for plain numbers. */
  unit = "",
  showSum = true,
  dense = false,
  selectedId,
  onSelect,
  onMove,
  className,
}: {
  columns: StageColumn[]
  unit?: string
  showSum?: boolean
  dense?: boolean
  selectedId?: string
  onSelect?: (cardId: string) => void
  onMove?: (cardId: string, fromColumn: string, toColumn: string) => void
  className?: string
}) {
  const [cols, setCols] = useState(columns)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overCol, setOverCol] = useState<string | null>(null)

  function drop(targetId: string) {
    setOverCol(null)
    if (!dragId) return
    const from = cols.find((c) => c.cards.some((card) => card.id === dragId))
    if (!from) return
    if (from.id !== targetId) {
      setCols((prev) =>
        prev.map((col) => {
          if (col.id === from.id) return { ...col, cards: col.cards.filter((c) => c.id !== dragId) }
          if (col.id === targetId) {
            const card = from.cards.find((c) => c.id === dragId)!
            return { ...col, cards: [...col.cards, card] }
          }
          return col
        }),
      )
      onMove?.(dragId, from.id, targetId)
    }
    setDragId(null)
  }

  return (
    <div className={cn("flex gap-2.5 overflow-x-auto", className)}>
      {cols.map((col) => {
        const sum = col.cards.reduce((s, c) => s + (c.numericValue ?? 0), 0)
        return (
          <div
            key={col.id}
            onDragOver={(e) => {
              e.preventDefault()
              setOverCol(col.id)
            }}
            onDragLeave={() => setOverCol((v) => (v === col.id ? null : v))}
            onDrop={(e) => {
              e.preventDefault()
              drop(col.id)
            }}
            className={cn(
              "flex min-w-48 flex-1 flex-col rounded-lg border bg-things-sidebar",
              overCol === col.id ? "border-things-blue ring-2 ring-things-blue/25" : "border-things-hairline",
            )}
          >
            <div className="flex items-baseline gap-1.5 border-b border-things-hairline px-2.5 pb-1.5 pt-2">
              <span className="text-[13px] font-semibold text-things-ink-strong">{col.name}</span>
              <span className="clinic-num text-[11px] text-things-gray-2">({col.cards.length})</span>
              {showSum && (
                <span className="clinic-num ml-auto text-[11px] font-semibold text-clinic-ok">
                  {unit}
                  {sum.toLocaleString("en-US")}
                </span>
              )}
            </div>
            <div className="flex min-h-10 flex-1 flex-col gap-1.5 p-2">
              {col.cards.map((card) => (
                <BoardCard
                  key={card.id}
                  {...card}
                  dense={dense}
                  draggable
                  selected={selectedId === card.id}
                  onClick={() => onSelect?.(card.id)}
                  onDragStart={() => setDragId(card.id)}
                  onDragEnd={() => setDragId(null)}
                  className={dragId === card.id ? "opacity-40" : undefined}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
