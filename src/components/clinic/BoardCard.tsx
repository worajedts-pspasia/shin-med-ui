import { cn } from "@/lib/utils"

/** Flow status for a board item — position in a workflow, not clinical
 *  severity (that axis belongs to TriageDot). */
export type BoardStatus = "ok" | "waiting" | "blocked" | "quiet"

export interface BoardCardData {
  id: string
  title: string
  /** Pre-formatted display value — "$17,500", "฿12,000", "12". */
  value?: string
  /** Summable amount feeding StageBoard column totals. Omit when the card
   *  carries no number. */
  numericValue?: number
  contact?: string
  contactInitials?: string
  status: BoardStatus
  statusLabel?: string
}

const EDGE: Record<BoardStatus, string> = {
  ok: "border-l-clinic-ok",
  waiting: "border-l-things-gold-dark",
  blocked: "border-l-clinic-critical",
  quiet: "border-l-things-gray",
}

const CHIP: Record<BoardStatus, string> = {
  ok: "bg-clinic-ok-soft text-clinic-ok",
  waiting: "bg-clinic-today text-clinic-warn",
  blocked: "bg-clinic-critical-soft text-clinic-critical",
  quiet: "bg-things-hover text-things-gray-2",
}

const DEFAULT_LABEL: Record<BoardStatus, string> = {
  ok: "On track",
  waiting: "Waiting",
  blocked: "Blocked",
  quiet: "Draft",
}

/** The plain Card surface, extended for board anatomy: title, a summable
 *  value in tabular figures, an optional contact line, and a two-channel
 *  color status — left edge plus soft chip, never a full-card fill. */
export function BoardCard({
  title,
  value,
  contact,
  contactInitials,
  status,
  statusLabel,
  selected = false,
  dense = false,
  onClick,
  draggable = false,
  onDragStart,
  onDragEnd,
  className,
}: {
  title: string
  value?: string
  contact?: string
  contactInitials?: string
  status: BoardStatus
  statusLabel?: string
  selected?: boolean
  dense?: boolean
  onClick?: () => void
  draggable?: boolean
  onDragStart?: () => void
  onDragEnd?: () => void
  className?: string
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        "rounded-md border border-things-border bg-white",
        selected ? "border-l-things-blue bg-things-blue-soft" : EDGE[status],
        dense ? "p-1.5" : "p-2",
        onClick && "cursor-pointer",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-[13px] font-semibold text-things-ink-strong">{title}</span>
        {value && <span className="clinic-num shrink-0 text-[13px] font-medium">{value}</span>}
      </div>
      {contact && !dense && (
        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-things-gray-2">
          {contactInitials && (
            <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-things-gold text-[8px] font-bold text-things-ink-strong">
              {contactInitials}
            </span>
          )}
          <span className="truncate">{contact}</span>
        </div>
      )}
      <span
        className={cn(
          "mt-1.5 inline-flex items-center gap-1 rounded-full px-2 text-[11px] font-semibold",
          CHIP[status],
        )}
      >
        <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
        {statusLabel ?? DEFAULT_LABEL[status]}
      </span>
    </div>
  )
}
