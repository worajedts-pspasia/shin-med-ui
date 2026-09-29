import type { LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

// InboxTile — module tile with unread count (04, Layer 7), the portal home's
// exact pattern: count as "(n)" after the title in gray — not a pill — plus a
// red badge on the icon when count > 0. Previews list dated items with source
// tags like "(MH)".

export interface InboxPreview {
  id: string
  at: string
  label: string
  sourceTag?: string
}

export function InboxTile({
  icon: Icon,
  title,
  count,
  emptyLabel,
  previews,
  onClick,
  className,
}: {
  icon: LucideIcon
  title: string
  count: number
  /** e.g. "No New Messages" */
  emptyLabel?: string
  previews?: InboxPreview[]
  onClick?: () => void
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <button
      type="button"
      data-slot="inbox-tile"
      data-count={count}
      onClick={onClick}
      className={cn(
        "flex h-full flex-col rounded-md border border-things-hairline bg-card p-3 text-left transition-colors hover:border-things-blue/40 hover:bg-things-hover/50 focus-visible:outline-2 focus-visible:outline-things-blue",
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="relative flex size-9 shrink-0 items-center justify-center rounded-md bg-things-select text-things-blue">
          <Icon className="size-4" aria-hidden="true" />
          {count > 0 && (
            <span
              data-slot="inbox-tile-badge"
              className="clinic-num absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-clinic-critical px-1 text-[10px] font-semibold leading-none text-white"
            >
              {count}
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-things-title">
          {title}
          {count > 0 && <span className="clinic-num ml-1 font-normal text-things-gray-2">({count})</span>}
        </span>
      </div>
      <div className="mt-2 min-h-0 flex-1">
        {previews && previews.length > 0 ? (
          <ul className="space-y-1">
            {previews.slice(0, 3).map((p) => (
              <li key={p.id} className="flex items-baseline gap-2 text-xs">
                <span className="clinic-num shrink-0 text-things-gray-2">{p.at}</span>
                <span className="min-w-0 flex-1 truncate text-things-ink">{p.label}</span>
                {p.sourceTag && <span className="shrink-0 text-things-gray-3">{p.sourceTag}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-things-gray-3">{emptyLabel ?? t("clinic.inbox.empty")}</p>
        )}
      </div>
    </button>
  )
}

export function InboxTileRow({ tiles, className }: { tiles: React.ComponentProps<typeof InboxTile>[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {tiles.map((tile) => (
        <InboxTile key={tile.title} {...tile} />
      ))}
    </div>
  )
}
