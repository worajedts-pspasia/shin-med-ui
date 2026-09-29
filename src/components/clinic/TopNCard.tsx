import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

// TopNCard — "Top Five Downtime" (04, Layer 8): ranked horizontal bars in
// clinic-warn (operations pain, not clinical severity), click-to-highlight
// with a sync-highlighted event table underneath.

export interface TopNItem {
  id: string
  label: string
  count: number
  events?: { at: string; label: string }[]
}

export function TopNCard({
  title,
  items,
  highlightId,
  onHighlight,
  className,
}: {
  title: string
  items: TopNItem[]
  /** Synced selection (e.g. from a linked chart); defaults to the top item. */
  highlightId?: string
  onHighlight?: (id: string) => void
  className?: string
}) {
  const { t } = useTranslation()
  const ranked = [...items].sort((a, b) => b.count - a.count)
  const max = ranked[0]?.count ?? 1
  const active = ranked.find((i) => i.id === (highlightId ?? ranked[0]?.id))

  return (
    <section
      data-slot="top-n-card"
      className={cn("overflow-hidden rounded-md border border-things-hairline bg-card", className)}
    >
      <h3 className="border-b border-things-hairline px-3 py-2 text-sm font-medium text-things-title">
        {title}
      </h3>
      <ul className="divide-y divide-things-hairline/60">
        {ranked.map((it, i) => {
          const on = it.id === active?.id
          return (
            <li key={it.id}>
              <button
                type="button"
                data-topn-item={it.id}
                aria-pressed={on}
                onClick={() => onHighlight?.(it.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors",
                  on ? "bg-things-select" : "hover:bg-things-hover",
                )}
              >
                <span className="clinic-num w-4 shrink-0 text-xs text-things-gray-3">{i + 1}</span>
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate text-sm",
                    on ? "font-medium text-things-blue" : "text-things-title",
                  )}
                >
                  {it.label}
                </span>
                <span className="relative h-4 w-24 shrink-0 overflow-hidden rounded-sm bg-things-hover sm:w-36">
                  <span
                    className="absolute inset-y-0 left-0 rounded-sm bg-clinic-warn"
                    style={{ width: `${Math.max(6, (it.count / max) * 100)}%` }}
                    aria-hidden="true"
                  />
                </span>
                <span className="clinic-num w-6 shrink-0 text-right text-sm font-medium text-things-title">
                  {it.count}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      {active && active.events && active.events.length > 0 && (
        <table data-slot="top-n-events" className="w-full border-t border-things-hairline text-sm">
          <caption className="sr-only">{t("clinic.ops.events", { label: active.label })}</caption>
          <tbody className="divide-y divide-things-hairline/60">
            {active.events.map((e) => (
              <tr key={e.at + e.label}>
                <td className="clinic-num w-28 whitespace-nowrap px-3 py-1.5 text-xs text-things-gray-2">
                  {e.at}
                </td>
                <td className="px-3 py-1.5 text-things-ink">{e.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
