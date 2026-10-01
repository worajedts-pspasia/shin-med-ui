// Design study — primitives for the two proposals. One markup, two design
// languages: study.css decides whether a Group is a macOS grouped form
// (label left, hairlines) or a Fluent card (header above, 4px radius).
// Hardcoded on purpose (study, not catalog) — see README.

import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"
import type { CodedConcept } from "@/components/clinic/types"
import { cn } from "@/lib/utils"

type BtnVariant = "default" | "primary" | "subtle" | "danger"
export function Btn({
  variant = "default", icon = false, className, ...props
}: React.ComponentProps<"button"> & { variant?: BtnVariant; icon?: boolean }) {
  return <button type="button" className={cn("st-btn", variant !== "default" && `st-btn--${variant}`, icon && "st-btn--icon", className)} {...props} />
}

export function SearchField({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <label className={cn("st-search", className)}>
      <Search aria-hidden="true" />
      <input type="search" className="st-input" {...props} />
    </label>
  )
}

export function Segmented<T extends string>({
  options, value, onChange, label, tone, className,
}: {
  options: Array<{ value: T; label: React.ReactNode }>
  value: T
  onChange: (v: T) => void
  label: string
  tone?: "danger" | "warn"
  className?: string
}) {
  return (
    <div role="group" aria-label={label} className={cn("st-seg", tone && `st-seg--${tone}`, className)}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Group({
  title, description, action, cols = 1, flush, children, className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  /** Fluent card column count (macOS rows always stack). */
  cols?: 1 | 2 | 3 | 4
  /** Body without padding — for tables and lists. */
  flush?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("st-group", className)}>
      <header className="st-group__head">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        {action}
      </header>
      <div className={cn("st-group__body", flush && "st-group__body--flush")} style={{ ["--st-cols" as string]: cols }}>
        {children}
      </div>
    </section>
  )
}

export function Row({
  label, required, error, hint, span, stack, htmlFor, children,
}: {
  label: React.ReactNode
  required?: boolean
  error?: string | false
  hint?: React.ReactNode
  /** Fluent: columns to span inside the card grid. */
  span?: number
  /** macOS: put the control under the label (long inputs, textareas). */
  stack?: boolean
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("st-row", stack && "st-row--stack")} style={span ? { ["--st-span" as string]: span } : undefined}>
      <label className="st-row__label" htmlFor={htmlFor}>
        {label}
        {required && <span className="st-row__req" aria-hidden="true">*</span>}
      </label>
      <div className="min-w-0">{children}</div>
      {error ? <span className="st-row__msg" role="alert">{error}</span> : hint ? <span className="st-row__hint st-row__msg" style={{ color: "var(--st-text-2)" }}>{hint}</span> : null}
    </div>
  )
}

export function Info({
  tone = "accent", icon: Icon, title, children, action, className, live,
}: {
  tone?: "accent" | "ok" | "warn" | "crit"
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  title: React.ReactNode
  children?: React.ReactNode
  action?: React.ReactNode
  className?: string
  live?: boolean
}) {
  return (
    <div className={cn("st-info", `st-info--${tone}`, className)} role={live ? "alert" : undefined}>
      <Icon aria-hidden />
      <div className="min-w-0 flex-1">
        <b>{title}</b> {children}
      </div>
      {action}
    </div>
  )
}

export function Badge({ tone, children, className }: { tone?: "ok" | "warn" | "crit" | "accent"; children: React.ReactNode; className?: string }) {
  return <span className={cn("st-badge", tone && `st-badge--${tone}`, className)}>{children}</span>
}

/* ——— table ——————————————————————————————————————————————————— */

export interface Col<T> {
  id: string
  header: React.ReactNode
  cell: (r: T) => React.ReactNode
  num?: boolean
  width?: number
  sortable?: boolean
  wrap?: boolean
  /** Hidden when the workspace is narrow (< 700px) — like DataTable's priority: "secondary". */
  optional?: boolean
}

export function Table<T>({
  columns, rows, rowKey, sort, onSort, selectedId, onRowClick, onRowOpen, checked, onCheck, rowClass, empty, label, maxHeight,
}: {
  columns: Array<Col<T>>
  rows: T[]
  rowKey: (r: T) => string
  sort?: { id: string; dir: "asc" | "desc" }
  onSort?: (id: string) => void
  selectedId?: string
  onRowClick?: (r: T) => void
  /** Double-click / Enter — the "open" gesture on both platforms. */
  onRowOpen?: (r: T) => void
  checked?: string[]
  onCheck?: (id: string) => void
  rowClass?: (r: T) => string | undefined
  empty?: React.ReactNode
  label: string
  maxHeight?: number | string
}) {
  return (
    <div className="st-table-wrap" style={{ maxHeight }}>
      <table className="st-table" aria-label={label}>
        <thead>
          <tr>
            {onCheck && <th style={{ width: 32 }}><span className="sr-only">Select</span></th>}
            {columns.map((c) => {
              const active = sort?.id === c.id
              return (
                <th key={c.id} className={cn(c.num && "num", c.optional && "st-opt")} style={{ width: c.width }} aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined}>
                  {c.sortable && onSort ? (
                    <button onClick={() => onSort(c.id)}>
                      {c.header}
                      {active && (sort!.dir === "asc" ? <ArrowUp className="size-3" aria-hidden="true" /> : <ArrowDown className="size-3" aria-hidden="true" />)}
                    </button>
                  ) : c.header}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={columns.length + (onCheck ? 1 : 0)} className="wrap" style={{ height: 64, textAlign: "center", color: "var(--st-text-2)" }}>{empty}</td></tr>
          )}
          {rows.map((r) => {
            const key = rowKey(r)
            return (
              <tr
                key={key}
                aria-selected={selectedId === key || undefined}
                className={rowClass?.(r)}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={() => onRowClick?.(r)}
                onDoubleClick={() => onRowOpen?.(r)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onRowOpen?.(r)
                  if (e.key === " " && onCheck) { e.preventDefault(); onCheck(key) }
                }}
              >
                {onCheck && (
                  <td onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="st-check" aria-label={`Select ${key}`} checked={checked?.includes(key) ?? false} onChange={() => onCheck(key)} />
                  </td>
                )}
                {columns.map((c) => <td key={c.id} className={cn(c.num && "num", c.wrap && "wrap", c.optional && "st-opt")}>{c.cell(r)}</td>)}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function Pager({ page, pageCount, total, size, onPage }: { page: number; pageCount: number; total: number; size: number; onPage: (n: number) => void }) {
  const from = total === 0 ? 0 : (page - 1) * size + 1
  const to = Math.min(total, page * size)
  return (
    <div className="st-pager">
      <span className="clinic-num">{from}–{to} of {total}</span>
      <span className="ml-auto clinic-num">Page {page} / {pageCount}</span>
      <Btn icon variant="subtle" aria-label="Previous page" disabled={page <= 1} onClick={() => onPage(page - 1)}><ChevronLeft /></Btn>
      <Btn icon variant="subtle" aria-label="Next page" disabled={page >= pageCount} onClick={() => onPage(page + 1)}><ChevronRight /></Btn>
    </div>
  )
}

/* ——— combobox (coded search) ————————————————————————————————————— */

export function Combo({
  search, onPick, placeholder, label, invalid, id,
}: {
  search: (q: string) => Promise<CodedConcept[]>
  onPick: (c: CodedConcept) => void
  placeholder?: string
  label: string
  invalid?: boolean
  id?: string
}) {
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<CodedConcept[]>([])
  const [active, setActive] = useState(0)
  const listId = useId()
  const req = useRef(0)

  useEffect(() => {
    const n = ++req.current
    if (!q.trim()) { setItems([]); return }
    void search(q.trim()).then((r) => { if (n === req.current) { setItems(r.slice(0, 8)); setActive(0) } })
  }, [q, search])

  const pick = (c: CodedConcept) => { onPick(c); setQ(""); setOpen(false) }

  return (
    <div className="st-combo">
      <SearchField
        id={id}
        role="combobox"
        aria-label={label}
        aria-expanded={open && items.length > 0}
        aria-controls={listId}
        aria-invalid={invalid || undefined}
        aria-activedescendant={open && items[active] ? `${listId}-${active}` : undefined}
        value={q}
        placeholder={placeholder}
        onChange={(e) => { setQ(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(items.length - 1, a + 1)) }
          if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)) }
          if (e.key === "Enter" && items[active]) { e.preventDefault(); pick(items[active]) }
          if (e.key === "Escape") setOpen(false)
        }}
      />
      {open && items.length > 0 && (
        <ul className="st-combo__list" role="listbox" id={listId}>
          {items.map((c, i) => (
            <li key={c.code} id={`${listId}-${i}`} role="option" aria-selected={i === active} className="st-combo__opt"
              onMouseDown={(e) => { e.preventDefault(); pick(c) }} onMouseEnter={() => setActive(i)}>
              <span className="st-mono" style={{ minWidth: 52 }}>{c.code}</span>
              <span className="flex-1">{c.term}</span>
              {c.localTerm && <span className="st-dim text-[11px]">{c.localTerm}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ——— dialog ————————————————————————————————————————————————— */

export function Dialog({ open, title, children, actions, onClose }: { open: boolean; title: React.ReactNode; children: React.ReactNode; actions: React.ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    ref.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => { window.removeEventListener("keydown", onKey); prev?.focus() }
  }, [open, onClose])
  if (!open) return null
  const titleId = "st-dialog-title"
  return (
    <div className="st-smoke" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div ref={ref} className="st-dialog" role="alertdialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="st-dialog__body">
          <h2 id={titleId}>{title}</h2>
          {children}
        </div>
        <div className="st-dialog__foot">{actions}</div>
      </div>
    </div>
  )
}
