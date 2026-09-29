import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { NativeSelect } from "@/components/ui/native-select"

// GroupedListPanel — the "Arranged By: …" grouped list (04, Layer 7): five
// WinForms EMR screens share this exact pattern, so it is built once. Group headers
// stick within the scroll container; the footer carries the pager.

export interface GroupedListPanelProps<T> {
  title?: string
  items: T[]
  itemKey: (item: T) => string
  /** Group ids in display order; drives the "Arranged by" selector. */
  groups: Array<{ id: string; label: string }>
  groupOf: (item: T) => string
  renderItem: (item: T) => React.ReactNode
  activeGroup?: string
  onGroupChange?: (id: string) => void
  footer?: React.ReactNode
  emptyState?: React.ReactNode
  maxHeight?: number | string
  className?: string
}

export function GroupedListPanel<T>({
  title,
  items,
  itemKey,
  groups,
  groupOf,
  renderItem,
  activeGroup,
  onGroupChange,
  footer,
  emptyState,
  maxHeight = 320,
  className,
}: GroupedListPanelProps<T>) {
  const { t } = useTranslation()

  const byGroup = new Map<string, T[]>()
  for (const g of groups) byGroup.set(g.id, [])
  for (const it of items) {
    const list = byGroup.get(groupOf(it))
    if (list) list.push(it)
  }
  const visible = groups.filter((g) => (byGroup.get(g.id) ?? []).length > 0)

  return (
    <div data-slot="grouped-list-panel" className={cn("flex flex-col overflow-hidden rounded-md border border-things-hairline bg-card", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-things-hairline px-2 py-1.5">
        {title && <span className="truncate text-sm font-semibold text-things-title">{title}</span>}
        <label className="ml-auto flex shrink-0 items-center gap-1.5 text-xs text-things-gray-3">
          {t("clinic.grouped.arrangedBy")}
          <NativeSelect
            aria-label={t("clinic.grouped.arrangedBy")}
            value={activeGroup ?? groups[0]?.id}
            disabled={!onGroupChange}
            onChange={(e) => onGroupChange?.(e.target.value)}
            className="h-7 w-auto max-w-36 py-0 text-xs"
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </NativeSelect>
        </label>
      </div>

      <div className="overflow-auto" style={{ maxHeight }}>
        {visible.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-things-gray-3">{emptyState ?? t("clinic.table.empty")}</p>
        ) : (
          visible.map((g) => (
            <section key={g.id}>
              <h4 className="sticky top-0 z-10 bg-clinic-grid-header px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-things-gray-2">
                {g.label}
                <span className="clinic-num ml-1.5 font-normal normal-case">({(byGroup.get(g.id) ?? []).length})</span>
              </h4>
              <ul>
                {(byGroup.get(g.id) ?? []).map((it) => (
                  <li key={itemKey(it)} className="border-b border-clinic-grid-line last:border-b-0">
                    {renderItem(it)}
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>

      {footer && <div className="border-t border-things-hairline">{footer}</div>}
    </div>
  )
}
