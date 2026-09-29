import { useEffect, useRef, useState } from "react"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { toneSoft } from "./tokens"
import type { Tone } from "./types"

// DataTable — the dense table primitive everything builds on (04, Layer 4).
// Sticky header + sticky first column, group rows, zebra, per-row severity
// tone, numeric alignment, sub-rows, column priority, windowed rendering.
// No table library — ui primitives plus this file only. Generic <T> from day
// one (06 §2); eleven downstream components compose this instead of reskinning.

export interface DataTableColumn<T> {
  id: string
  header: React.ReactNode
  width?: number
  align?: "start" | "end"
  /** Pin the column during horizontal scroll. */
  sticky?: "start" | "end"
  /** Tabular numerals + right alignment + [data-numeric] for the verifier. */
  numeric?: boolean
  /** Secondary columns hide below md (04: column priority). */
  priority?: "primary" | "secondary"
  cell: (row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  columns: Array<DataTableColumn<T>>
  rows: T[]
  rowKey: (row: T) => string
  zebra?: boolean
  rowTone?: (row: T) => Tone
  groupBy?: (row: T) => { id: string; label: React.ReactNode }
  selected?: string[]
  onSelect?: (id: string) => void
  sort?: { id: string; dir: "asc" | "desc" }
  onSort?: (id: string) => void
  emptyState?: React.ReactNode
  /** Interpretive note rendered under a row (e.g. under a flagged lab). */
  subRow?: (row: T) => React.ReactNode
  /** Extra per-row classes (e.g. a neutral tint) applied to every cell. */
  rowClass?: (row: T) => string
  /** Row count at which windowed rendering kicks in (default 200). */
  virtualizeAbove?: number
  maxHeight?: number | string
  className?: string
}

// Static class maps — Tailwind's JIT cannot see template-built classes.
const ALIGN = { start: "text-left", end: "text-right" } as const

const OVERSCAN = 10

export function DataTable<T>(props: DataTableProps<T>) {
  const {
    columns, rows, rowKey, zebra = false, rowTone, groupBy, selected, onSelect,
    sort, onSort, emptyState, subRow, rowClass, virtualizeAbove = 200, maxHeight, className,
  } = props
  const { t } = useTranslation()
  const totalCols = columns.length + (onSelect ? 1 : 0)
  const selectedSet = new Set(selected ?? [])

  // ——— windowed rendering (uniform row height only: no groups, no sub-rows) ———
  const canVirtualize = rows.length >= virtualizeAbove && !groupBy && !subRow
  const scrollRef = useRef<HTMLDivElement>(null)
  const rowPxRef = useRef(26)
  const [window_, setWindow] = useState({ start: 0, end: OVERSCAN * 4 })

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const v = getComputedStyle(el).getPropertyValue("--clinic-row-h").trim()
    const m = /^([\d.]+)(px|rem)$/.exec(v)
    if (m) rowPxRef.current = parseFloat(m[1]) * (m[2] === "rem" ? 16 : 1)
  }, [])

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const rowH = rowPxRef.current
    const start = Math.max(0, Math.floor(el.scrollTop / rowH) - OVERSCAN)
    const end = Math.min(rows.length, start + Math.ceil(el.clientHeight / rowH) + OVERSCAN * 2)
    setWindow((w) => (w.start === start && w.end === end ? w : { start, end }))
  }

  const [startIdx, endIdx] = canVirtualize ? [window_.start, window_.end] : [0, rows.length]

  const cellBg = (i: number, key: string, tone: Tone) => {
    if (selectedSet.has(key)) return "bg-things-blue-soft"
    if (tone !== "none") return toneSoft[tone]
    if (zebra && i % 2 === 1) return "bg-clinic-zebra"
    return "bg-card"
  }

  const renderRow = (row: T, i: number) => {
    const key = rowKey(row)
    const tone = rowTone?.(row) ?? "none"
    const bg = cellBg(i, key, tone)
    // tone/selected must survive hover — only plain rows get the hover wash
    const hoverCls = tone === "none" && !selectedSet.has(key) ? "group-hover/tr:bg-things-hover" : ""
    const cellCls = cn("border-b border-clinic-grid-line", hoverCls, rowClass?.(row))
    const rowStyle = { height: "var(--clinic-row-h, 1.875rem)" } as const
    const cellStyle = (col?: { width?: number }) => ({
      fontSize: "var(--clinic-font, 0.8125rem)",
      paddingLeft: "var(--clinic-row-px, 0.5rem)",
      paddingRight: "var(--clinic-row-px, 0.5rem)",
      ...(col?.width !== undefined ? { width: col.width, minWidth: col.width } : {}),
    })
    const nodes = [
      <tr key={key} data-row-key={key} className="group/tr" style={rowStyle}>
        {onSelect && (
          <td
            className={cn("sticky left-0 z-20 w-10 text-center", bg, cellCls)}
            style={cellStyle()}
          >
            <input
              type="checkbox"
              aria-label={`Select row ${key}`}
              checked={selectedSet.has(key)}
              onChange={() => onSelect(key)}
              className="size-3.5 accent-things-blue"
            />
          </td>
        )}
        {columns.map((col) => (
          <td
            key={col.id}
            data-numeric={col.numeric ? "" : undefined}
            className={cn(
              "whitespace-nowrap align-middle",
              ALIGN[col.align ?? (col.numeric ? "end" : "start")],
              col.numeric && "clinic-num",
              col.priority === "secondary" && "hidden md:table-cell",
              col.sticky === "start" && "sticky left-0 z-20",
              col.sticky === "end" && "sticky right-0 z-20",
              bg,
              cellCls,
            )}
            style={cellStyle(col)}
          >
            {col.cell(row)}
          </td>
        ))}
      </tr>,
    ]
    if (subRow) {
      const note = subRow(row)
      if (note) {
        nodes.push(
          <tr key={`${key}__sub`} aria-hidden="false">
            <td
              colSpan={totalCols}
              className="border-b border-clinic-grid-line bg-card px-4 py-1 text-xs text-things-gray-2"
            >
              {note}
            </td>
          </tr>,
        )
      }
    }
    return nodes
  }

  let body: React.ReactNode[] = []
  let visibleIdx = 0
  let lastGroup: string | undefined
  for (let i = startIdx; i < endIdx; i++) {
    const row = rows[i]
    if (groupBy) {
      const g = groupBy(row)
      if (g.id !== lastGroup) {
        lastGroup = g.id
        body.push(
          <tr key={`g-${g.id}`} data-group-id={g.id}>
            <td
              colSpan={totalCols}
              className="sticky left-0 z-20 border-b border-clinic-grid-line bg-clinic-lane px-[var(--clinic-row-px, 0.5rem)] text-[11px] font-semibold text-things-gray-2"
            >
              {g.label}
            </td>
          </tr>,
        )
      }
    }
    body.push(renderRow(row, visibleIdx))
    visibleIdx++
  }

  if (rows.length === 0) {
    body = [
      <tr key="__empty">
        <td colSpan={totalCols} className="bg-card px-3 py-8 text-center text-sm text-things-gray-3">
          {emptyState ?? t("clinic.table.empty")}
        </td>
      </tr>,
    ]
  }

  const header = (
    <tr>
      {onSelect && (
        <th
          className="sticky left-0 top-0 z-40 w-10 border-b border-clinic-grid-line bg-clinic-grid-header"
          style={{ height: "var(--clinic-row-h, 1.875rem)" }}
        />
      )}
      {columns.map((col) => {
        const sortable = Boolean(onSort)
        const active = sort?.id === col.id
        const SortIcon = active ? (sort!.dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown
        return (
          <th
            key={col.id}
            aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined}
            className={cn(
              "whitespace-nowrap border-b border-clinic-grid-line bg-clinic-grid-header text-[11px] font-semibold uppercase tracking-wide text-things-gray-2",
              "sticky top-0 z-30",
              ALIGN[col.align ?? (col.numeric ? "end" : "start")],
              col.numeric && "clinic-num",
              col.priority === "secondary" && "hidden md:table-cell",
              col.sticky === "start" && "left-0 z-40",
              col.sticky === "end" && "right-0 z-40",
              sortable && "cursor-pointer select-none hover:text-things-title",
            )}
            style={{
              height: "var(--clinic-row-h, 1.875rem)",
              fontSize: "11px",
              paddingLeft: "var(--clinic-row-px, 0.5rem)",
              paddingRight: "var(--clinic-row-px, 0.5rem)",
              ...(col.width !== undefined ? { width: col.width, minWidth: col.width } : {}),
            }}
            onClick={sortable ? () => onSort?.(col.id) : undefined}
          >
            <span className="inline-flex items-center gap-1">
              {col.header}
              {sortable && (
                <SortIcon
                  className={cn("size-3", active ? "text-things-title" : "text-things-gray-3 opacity-60")}
                  aria-hidden="true"
                />
              )}
            </span>
          </th>
        )
      })}
    </tr>
  )

  return (
    <div
      ref={scrollRef}
      data-slot="data-table"
      onScroll={canVirtualize ? onScroll : undefined}
      className={cn("relative min-w-0 w-full overflow-auto bg-card", className)}
      style={maxHeight !== undefined ? { maxHeight } : undefined}
    >
      {/* border-separate so sticky header cells keep their borders while pinned */}
      <table className="w-full border-separate border-spacing-0 caption-bottom text-sm">
        <thead>{header}</thead>
        <tbody>
          {canVirtualize && startIdx > 0 && (
            <tr aria-hidden="true" style={{ height: startIdx * rowPxRef.current }}>
              <td colSpan={totalCols} />
            </tr>
          )}
          {body}
          {canVirtualize && endIdx < rows.length && (
            <tr aria-hidden="true" style={{ height: (rows.length - endIdx) * rowPxRef.current }}>
              <td colSpan={totalCols} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
