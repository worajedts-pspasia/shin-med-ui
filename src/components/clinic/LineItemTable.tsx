import { Copy, Pencil, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

// LineItemTable — editable rows with a totals footer (04, Layer 6; 02.3/02.4
// result tables, Charge Summary). Inline edit, per-row Copy/Delete,
// right-aligned numerics, a rule above totals, optional bundle-billing
// checkbox. Used by prescriptions, lab orders and charge capture alike.

export interface LineItemDef {
  id: string
  cells: Array<{ node: React.ReactNode; numeric?: boolean }>
  status?: "ok" | "warn"
}

export function LineItemTable({
  rows,
  headers,
  onEdit,
  onDelete,
  onDuplicate,
  totals,
  bundleOption,
  className,
}: {
  rows: LineItemDef[]
  headers: Array<{ label: React.ReactNode; numeric?: boolean }>
  onEdit?(id: string): void
  onDelete?(id: string): void
  onDuplicate?(id: string): void
  totals?: Array<{ label: string; value: string }>
  bundleOption?: { label: string; checked: boolean; onChange(v: boolean): void }
  className?: string
}) {
  const { t } = useTranslation()
  const nCols = headers.length + 1
  return (
    <div data-slot="line-item-table" className={cn("overflow-x-auto rounded-md border border-things-hairline bg-card", className)}>
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className={cn(
                  "sticky top-0 z-10 whitespace-nowrap border-b border-clinic-grid-line bg-clinic-grid-header px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-things-gray-2",
                  h.numeric ? "text-right" : "text-left",
                )}
              >
                {h.label}
              </th>
            ))}
            <th className="sticky top-0 z-10 w-20 border-b border-clinic-grid-line bg-clinic-grid-header" aria-label={t("clinic.lineitem.actions")} />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="group/li">
              {r.cells.map((c, i) => (
                <td
                  key={i}
                  data-numeric={headers[i]?.numeric ? "" : undefined}
                  className={cn(
                    "whitespace-nowrap border-b border-clinic-grid-line px-2 py-1.5",
                    headers[i]?.numeric && "clinic-num text-right",
                    i === 0 && "text-things-title",
                  )}
                >
                  <span className="flex items-center justify-end gap-1.5">
                    {r.status && (
                      <span className={cn("size-1.5 shrink-0 rounded-full", r.status === "ok" ? "bg-clinic-ok" : "bg-clinic-warn")} aria-label={r.status === "ok" ? t("clinic.lineitem.ok") : t("clinic.lineitem.warn")} />
                    )}
                    {c.node}
                  </span>
                </td>
              ))}
              <td className="border-b border-clinic-grid-line px-1 py-1 text-right">
                <span className="flex justify-end opacity-0 transition-opacity group-hover/li:opacity-100 focus-within:opacity-100">
                  {onEdit && (
                    <Button variant="ghost" size="icon-xs" aria-label={t("clinic.lineitem.edit")} onClick={() => onEdit(r.id)}>
                      <Pencil aria-hidden="true" />
                    </Button>
                  )}
                  {onDuplicate && (
                    <Button variant="ghost" size="icon-xs" aria-label={t("clinic.lineitem.duplicate")} onClick={() => onDuplicate(r.id)}>
                      <Copy aria-hidden="true" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="ghost" size="icon-xs" aria-label={t("clinic.lineitem.delete")} className="text-clinic-critical" onClick={() => onDelete(r.id)}>
                      <Trash2 aria-hidden="true" />
                    </Button>
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        {(totals || bundleOption) && (
          <tfoot>
            {bundleOption && (
              <tr>
                <td colSpan={nCols} className="px-2 py-1.5">
                  <label className="flex min-h-6 cursor-pointer select-none items-center gap-2 text-xs text-things-gray-2">
                    <Checkbox checked={bundleOption.checked} onCheckedChange={(v) => bundleOption.onChange(Boolean(v))} />
                    {bundleOption.label}
                  </label>
                </td>
              </tr>
            )}
            {totals?.map((tot) => (
              <tr key={tot.label}>
                <td colSpan={nCols - 1} className="border-t border-things-hairline px-2 py-1.5 text-right text-xs text-things-gray-3">
                  {tot.label}
                </td>
                <td className="clinic-num border-t border-things-hairline px-2 py-1.5 text-right font-semibold text-things-title">{tot.value}</td>
              </tr>
            ))}
          </tfoot>
        )}
      </table>
    </div>
  )
}
