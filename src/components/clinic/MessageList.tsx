import { Paperclip } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { PaginationFooter } from "./PaginationFooter"

// MessageListRow / MessageList — inbox rows for message-like entities
// (04, Layer 7): fax, Direct email and internal mail — one component, three
// dialects. Unread = font-medium + blue dot; attachment glyph after the
// subject; date-range group headers sticky in the scroll container; pager
// footer. Meta columns drop to a second line below md.

export interface MessageListRowProps {
  sender: string
  subject: string
  at: string
  read?: boolean
  hasAttachment?: boolean
  onClick?: () => void
  active?: boolean
}

function Row({ sender, subject, at, read = true, hasAttachment, onClick, active }: MessageListRowProps) {
  return (
    <button
      type="button"
      data-slot="message-row"
      data-unread={read ? undefined : ""}
      aria-current={active ? "true" : undefined}
      onClick={onClick}
      className={cn(
        "flex w-full flex-col gap-0.5 px-3 py-2 text-left text-sm transition-colors md:flex-row md:items-center md:gap-3",
        active ? "bg-things-select" : "hover:bg-things-hover",
      )}
    >
      {/* ≥md: sender | subject | date columns; <md: subject first, meta second */}
      <span className="order-2 flex min-w-0 items-baseline gap-2 md:order-1 md:w-52 md:shrink-0">
        {!read && <span className="size-1.5 shrink-0 translate-y-[-1px] rounded-full bg-things-blue" aria-label="unread" />}
        <span className={cn("truncate", read ? "text-things-title" : "font-medium text-things-title")}>{sender}</span>
        <span className="clinic-num ml-auto shrink-0 text-xs text-things-gray-2 md:hidden">{at}</span>
      </span>
      <span
        className={cn(
          "order-1 min-w-0 flex-1 truncate md:order-2",
          read ? "text-things-ink" : "font-medium text-things-ink",
        )}
      >
        {subject}
        {hasAttachment && <Paperclip className="ml-1.5 inline size-3.5 shrink-0 text-things-gray-3" aria-label="attachment" />}
      </span>
      <span className="clinic-num order-3 hidden w-28 shrink-0 text-right text-xs text-things-gray-2 md:block">{at}</span>
    </button>
  )
}

export function MessageList({
  groups,
  total,
  page,
  pageCount,
  onPage,
  maxHeight = 420,
  className,
}: {
  groups: { label: string; rows: MessageListRowProps[] }[]
  total: number
  page?: number
  pageCount?: number
  onPage?: (page: number) => void
  maxHeight?: number
  className?: string
}) {
  const { t } = useTranslation()
  const empty = groups.every((g) => g.rows.length === 0)
  return (
    <div
      data-slot="message-list"
      className={cn("flex flex-col overflow-hidden rounded-md border border-things-hairline bg-card", className)}
    >
      <div className="min-h-0 flex-1 overflow-y-auto" style={{ maxHeight }}>
        {empty && <p className="p-6 text-center text-sm text-things-gray-3">{t("clinic.msglist.empty")}</p>}
        {groups.map((g) => (
          <section key={g.label}>
            <h4 className="sticky top-0 z-10 border-b border-things-hairline bg-card/95 px-3 py-1 text-xs font-medium text-things-gray-2 backdrop-blur-sm">
              {g.label}
            </h4>
            <div className="divide-y divide-things-hairline/60">
              {g.rows.map((r, i) => (
                <Row key={`${g.label}-${i}`} {...r} />
              ))}
            </div>
          </section>
        ))}
      </div>
      {page !== undefined && pageCount !== undefined && onPage && (
        <PaginationFooter total={total} page={page} pageCount={pageCount} onPage={onPage} />
      )}
    </div>
  )
}

export { Row as MessageListRow }
