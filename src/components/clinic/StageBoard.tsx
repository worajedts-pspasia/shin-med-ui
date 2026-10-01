import { useState } from "react"
import { cn } from "@/lib/utils"
import { BoardCard, type BoardCardData } from "./BoardCard"

export interface StageColumn {
  id: string
  name: string
  cards: BoardCardData[]
}

/** Drop target while dragging: which column, and the insertion index
 *  (card-level zones carry above/below indices; the column body is the
 *  append zone with index === cards.length). */
interface DropHint {
  col: string
  index: number
}

/** Columns of movable cards — one column per stage of a Stage Flow Bar.
 *  Each column header reports the card count and the column sum (money or
 *  any summable quantity, unit-prefixed), re-derived from data on every
 *  move — never from the DOM. Cards drop at an exact position: above or
 *  below the hovered card, or appended past the last one. */
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
  const [over, setOver] = useState<DropHint | null>(null)

  function moveTo(targetCol: string, index: number) {
    if (!dragId) return
    const from = cols.find((c) => c.cards.some((card) => card.id === dragId))
    if (!from) return
    const card = from.cards.find((c) => c.id === dragId)!
    setCols((prev) =>
      prev.map((col) => {
        if (col.id === from.id && col.id !== targetCol) {
          return { ...col, cards: col.cards.filter((c) => c.id !== dragId) }
        }
        if (col.id === targetCol) {
          const cards = [...col.cards]
          const original = from.id === targetCol ? cards.indexOf(card) : -1
          if (original !== -1) cards.splice(original, 1)
          let i = index
          if (original !== -1 && original < i) i -= 1
          cards.splice(Math.max(0, Math.min(i, cards.length)), 0, card)
          return { ...col, cards }
        }
        return col
      }),
    )
    onMove?.(dragId, from.id, targetCol)
    setDragId(null)
    setOver(null)
  }

  return (
    <div className={cn("flex gap-2.5 overflow-x-auto", className)}>
      {cols.map((col) => {
        const sum = col.cards.reduce((s, c) => s + (c.numericValue ?? 0), 0)
        const appendHere = over?.col === col.id && over.index === col.cards.length
        return (
          <div
            key={col.id}
            className={cn(
              "flex min-w-48 flex-1 flex-col rounded-md border bg-things-sidebar",
              appendHere ? "border-things-blue ring-2 ring-things-blue/25" : "border-things-hairline",
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
            <div
              className="flex min-h-10 flex-1 flex-col gap-1.5 p-2"
              onDragOver={(e) => {
                e.preventDefault()
                setOver({ col: col.id, index: col.cards.length })
              }}
              onDrop={(e) => {
                e.preventDefault()
                if (over?.col === col.id) moveTo(col.id, over.index)
              }}
            >
              {col.cards.map((card, i) => {
                const dropAbove = over?.col === col.id && over.index === i
                const dropBelow =
                  over?.col === col.id && over.index === i + 1 && i === col.cards.length - 1
                return (
                  <div
                    key={card.id}
                    onDragOver={(e) => {
                      if (!dragId || dragId === card.id) return
                      e.preventDefault()
                      e.stopPropagation()
                      const r = e.currentTarget.getBoundingClientRect()
                      const after = e.clientY - r.top > r.height / 2
                      setOver({ col: col.id, index: i + (after ? 1 : 0) })
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (over?.col === col.id) moveTo(col.id, over.index)
                    }}
                    className={cn(
                      dropAbove && "border-t-2 border-t-things-blue",
                      dropBelow && "border-b-2 border-b-things-blue",
                    )}
                  >
                    <BoardCard
                      {...card}
                      dense={dense}
                      draggable
                      selected={selectedId === card.id}
                      onClick={() => onSelect?.(card.id)}
                      onDragStart={() => setDragId(card.id)}
                      onDragEnd={() => setDragId(null)}
                      className={dragId === card.id ? "opacity-40" : undefined}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
