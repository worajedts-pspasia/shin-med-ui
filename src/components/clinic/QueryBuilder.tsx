import { useState } from "react"
import { ChevronDown, ChevronUp, GripVertical, Play, Plus, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable, type DataTableColumn } from "./DataTable"

// QueryBuilder — clinical reporting rule editor (04, Layer 9): field /
// operator / value rule rows, OR'd criteria chips, run + results with bulk
// actions. Desktop-only surface; a field-metadata registry feeds `fields`.

export type QueryFieldType = "text" | "number" | "date" | "select"

export interface QueryField {
  id: string
  label: string
  type: QueryFieldType
  options?: string[]
}

export interface QueryRule {
  id: string
  fieldId: string
  op: string
  value: string
}

const OPS: Record<QueryFieldType, string[]> = {
  text: ["contains", "equals", "starts with"],
  number: ["=", "≠", "<", ">", "≤", "≥"],
  date: ["before", "after", "on"],
  select: ["is", "is not"],
}

export function QueryBuilder({
  fields,
  rules,
  onRules,
  onRun,
  resultColumns,
  resultRows,
  rowKey,
  actions,
  onAction,
  resultLabel,
  className,
}: {
  fields: QueryField[]
  /** Rules are OR'd. */
  rules: QueryRule[]
  onRules: (rules: QueryRule[]) => void
  onRun?: () => void
  resultColumns: Array<DataTableColumn<Record<string, string>>>
  resultRows: Array<Record<string, string>>
  rowKey: (row: Record<string, string>) => string
  actions?: { id: string; label: string }[]
  onAction?: (actionId: string, selected: string[]) => void
  resultLabel?: string
  className?: string
}) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<string[]>([])
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const fieldById = new Map(fields.map((f) => [f.id, f]))
  const nextId = () => `r${Date.now() % 100000}-${rules.length}`

  const patch = (id: string, part: Partial<QueryRule>) =>
    onRules(rules.map((r) => (r.id === id ? { ...r, ...part } : r)))

  const moveAt = (from: number, to: number) => {
    if (to < 0 || to >= rules.length || from === to) return
    const next = [...rules]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onRules(next)
  }
  const dropBefore = (draggedId: string, targetId: string) => {
    const from = rules.findIndex((r) => r.id === draggedId)
    if (from < 0 || draggedId === targetId) return
    const rest = rules.filter((_, i) => i !== from)
    const to = rest.findIndex((r) => r.id === targetId)
    onRules([...rest.slice(0, to), rules[from], ...rest.slice(to)])
  }

  return (
    <div
      data-slot="query-builder"
      className={cn("space-y-3 rounded-md border border-things-hairline bg-card p-3", className)}
    >
      <div className="hidden lg:block">
        <ul className="space-y-2">
          {rules.map((r, i) => {
            const field = fieldById.get(r.fieldId)
            const ops = OPS[field?.type ?? "text"]
            const dropHint = dragId && dragId !== r.id && overId === r.id
            return (
              <li
                key={r.id}
                data-rule={r.id}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.dataTransfer.dropEffect = "move"
                  setOverId(r.id)
                }}
                onDragLeave={() => setOverId((cur) => (cur === r.id ? null : cur))}
                onDrop={(e) => {
                  e.preventDefault()
                  const id = e.dataTransfer.getData("text/query-rule") || dragId
                  if (id) dropBefore(id, r.id)
                  setDragId(null)
                  setOverId(null)
                }}
                className={cn(
                  "-mx-1 flex flex-wrap items-center gap-2 rounded-sm px-1 py-1 transition-shadow",
                  dropHint && "shadow-[inset_0_2px_0_0_var(--color-things-blue)]",
                  dragId === r.id && "opacity-50",
                )}
              >
                <span
                  draggable
                  data-drag-handle={r.id}
                  aria-label={t("clinic.query.drag")}
                  onDragStart={(e) => {
                    setDragId(r.id)
                    e.dataTransfer.effectAllowed = "move"
                    e.dataTransfer.setData("text/query-rule", r.id)
                  }}
                  onDragEnd={() => {
                    setDragId(null)
                    setOverId(null)
                  }}
                  className="cursor-grab self-center text-things-gray-3 transition-colors hover:text-things-title active:cursor-grabbing"
                >
                  <GripVertical className="size-4" aria-hidden="true" />
                </span>
                <Select value={r.fieldId} onValueChange={(v) => patch(r.id, { fieldId: v, op: OPS[fieldById.get(v)?.type ?? "text"][0], value: "" })}>
                  <SelectTrigger size="sm" className="w-44" aria-label={t("clinic.query.field")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((f) => (
                      <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={r.op} onValueChange={(v) => patch(r.id, { op: v })}>
                  <SelectTrigger size="sm" className="w-28" aria-label={t("clinic.query.op")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ops.map((op) => (
                      <SelectItem key={op} value={op}>{op}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field?.type === "select" && field.options ? (
                  <Select value={r.value || undefined} onValueChange={(v) => patch(r.id, { value: v })}>
                    <SelectTrigger size="sm" className="w-40" aria-label={t("clinic.query.value")}>
                      <SelectValue placeholder={t("clinic.query.value")} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={r.value}
                    onChange={(e) => patch(r.id, { value: e.target.value })}
                    type={field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text"}
                    className="h-8 w-44 text-sm"
                    aria-label={t("clinic.query.value")}
                  />
                )}
                <span className="flex flex-col">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={t("clinic.query.moveUp")}
                    disabled={i === 0}
                    onClick={() => moveAt(i, i - 1)}
                  >
                    <ChevronUp aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={t("clinic.query.moveDown")}
                    disabled={i === rules.length - 1}
                    onClick={() => moveAt(i, i + 1)}
                  >
                    <ChevronDown aria-hidden="true" />
                  </Button>
                </span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={t("clinic.query.remove")}
                  onClick={() => onRules(rules.filter((x) => x.id !== r.id))}
                >
                  <X aria-hidden="true" />
                </Button>
              </li>
            )
          })}
        </ul>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onRules([...rules, { id: nextId(), fieldId: fields[0]?.id ?? "", op: OPS[fields[0]?.type ?? "text"][0], value: "" }])
            }
          >
            <Plus className="size-3.5" aria-hidden="true" />
            {t("clinic.query.addRule")}
          </Button>
          {/* OR'd criteria chips */}
          <div className="flex flex-wrap items-center gap-1.5" aria-label={t("clinic.query.criteria")}>
            {rules.map((r, i) => (
              <span key={r.id} className="inline-flex items-center gap-1 rounded-full bg-things-blue-soft px-2 py-0.5 text-xs text-things-blue">
                {i > 0 && <span className="font-semibold uppercase">{t("clinic.query.or")}</span>}
                {fieldById.get(r.fieldId)?.label ?? r.fieldId} {r.op} {r.value || "…"}
              </span>
            ))}
          </div>
          <Button size="sm" className="ml-auto" onClick={onRun}>
            <Play className="size-3.5" aria-hidden="true" />
            {t("clinic.query.run")}
          </Button>
        </div>
      </div>

      <p className="text-xs text-things-gray-3 lg:hidden">{t("clinic.query.desktopOnly")}</p>

      <div className="overflow-hidden rounded-md border border-things-hairline">
        <p className="border-b border-things-hairline px-3 py-1.5 text-xs text-things-gray-2">
          {resultLabel ?? t("clinic.query.results", { count: resultRows.length })}
        </p>
        <DataTable
          columns={resultColumns}
          rows={resultRows}
          rowKey={rowKey}
          selected={actions ? selected : undefined}
          onSelect={actions ? (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])) : undefined}
          emptyState={<p className="p-4 text-sm text-things-gray-3">{t("clinic.query.noResults")}</p>}
        />
        {actions && actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-things-hairline px-3 py-2">
            <span className="clinic-num text-xs text-things-gray-2">
              {selected.length} {t("clinic.query.bulkHint")}
            </span>
            {actions.map((a) => (
              <Button key={a.id} variant="outline" size="sm" className="h-7 text-xs" onClick={() => onAction?.(a.id, selected)}>
                {a.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
