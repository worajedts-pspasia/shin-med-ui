import { Paperclip, UserSquare2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageHeader } from "@/components/ui/message"
import { Marker } from "@/components/ui/marker"
import { AttachmentChip, type AttachmentRef } from "./AttachmentChip"

// MessageThread — the conversation view (04, Layer 7; the wave-4 gate story:
// chat + quote block + system marker + unread divider in ONE scroll). Chat
// turns render as bubbles (in: avatar/name/role left; out: primary right,
// read receipts). Quote-block mode renders email-shaped legacy turns as
// full-width cards — the faithful translation of WinForms EMR's blue gradient quote
// box onto Things surfaces, so legacy messages and chat share one stream.
// System events are centered markers. No PHI in fixtures.

export type ThreadEntry =
  | { id: string; kind: "chat"; authorId: string; at: string; body: string; attachments?: AttachmentRef[]; direction: "in" | "out"; status?: "sent" | "delivered" | "read" }
  | { id: string; kind: "quote"; at: string; header: { from: string; sent: string; to: string; subject: string }; body: string; direction: "in" | "out" }
  | { id: string; kind: "system"; at: string; text: string; tone?: "info" | "warning" }
  | { id: string; kind: "divider"; at: string; label?: string }

export interface ThreadParticipant {
  name: string
  avatarUrl?: string
  role?: string
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

function timeOf(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(new Date(iso))
}

export function MessageThread({
  entries,
  participants,
  currentUserId,
  patientContext,
  unreadBefore,
  onEntryClick,
  className,
}: {
  entries: ThreadEntry[]
  participants: Record<string, ThreadParticipant>
  currentUserId: string
  patientContext?: { chartId: string; name: string }
  /** Entry id above which the "Unread" divider renders. */
  unreadBefore?: string
  onEntryClick?(entry: ThreadEntry): void
  className?: string
}) {
  const { t, i18n } = useTranslation()
  const unreadIdx = unreadBefore ? entries.findIndex((e) => e.id === unreadBefore) : -1

  return (
    <div data-slot="message-thread" className={cn("flex flex-col gap-3", className)}>
      {patientContext && (
        <p data-patient-context className="inline-flex w-fit items-center gap-1.5 rounded-full border border-things-tag-border bg-things-chip px-2.5 py-0.5 text-xs text-things-gray-2">
          <UserSquare2 className="size-3.5 text-things-blue" aria-hidden="true" />
          {t("clinic.msg.re")}: {t("clinic.msg.chart")} #{patientContext.chartId} — {patientContext.name}
        </p>
      )}

      {entries.map((e, i) => {
        const unread = unreadIdx >= 0 && i === unreadIdx
        return (
          <div key={e.id} className="contents">
            {(unread || e.kind === "divider") && (
              <div data-entry-kind="divider" className="my-1 flex items-center justify-center gap-2">
                <span className="h-px flex-1 bg-things-hairline" aria-hidden="true" />
                <span className={cn("text-[11px] font-medium", unread ? "text-things-blue" : "text-things-gray-3")}>
                  {unread ? t("clinic.msg.unread") : (e as Extract<ThreadEntry, { kind: "divider" }>).label ?? ""}
                </span>
                <span className="h-px flex-1 bg-things-hairline" aria-hidden="true" />
              </div>
            )}

            {e.kind === "system" && (
              <div data-entry-kind="system" className="my-1 flex justify-center">
                <Marker variant={e.tone === "warning" ? "separator" : "default"}>
                  <span className="text-[11px] text-things-gray-2">{e.text}</span>
                </Marker>
              </div>
            )}

            {e.kind === "quote" && (
              <button
                type="button"
                data-entry-kind="quote"
                onClick={() => onEntryClick?.(e)}
                className="w-full rounded-md border border-things-hairline bg-things-chip-soft p-2.5 text-left transition-colors hover:bg-things-chip"
              >
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[11px]">
                  {(
                    [
                      [t("clinic.msg.from"), e.header.from],
                      [t("clinic.msg.sent"), e.header.sent],
                      [t("clinic.msg.to"), e.header.to],
                      [t("clinic.msg.subject"), e.header.subject],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k} className="col-span-2 grid grid-cols-subgrid">
                      <dt className="font-medium text-things-gray-3">{k}</dt>
                      <dd className="truncate text-things-gray-2">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-2 text-sm text-things-ink">{e.body}</p>
              </button>
            )}

            {e.kind === "chat" && (
              <Message data-entry-kind="chat" align={e.direction === "out" ? "end" : "start"} onClick={() => onEntryClick?.(e)}>
                {e.direction === "in" && (
                  <MessageAvatar aria-label={participants[e.authorId]?.name ?? e.authorId}>
                    {participants[e.authorId]?.avatarUrl ? (
                      <img src={participants[e.authorId]!.avatarUrl} alt="" className="size-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-semibold text-things-gray-2">{initials(participants[e.authorId]?.name ?? e.authorId)}</span>
                    )}
                  </MessageAvatar>
                )}
                <MessageContent>
                  {e.direction === "in" && (
                    <MessageHeader>{participants[e.authorId]?.name ?? e.authorId}</MessageHeader>
                  )}
                  <Bubble variant={e.direction === "out" ? "default" : "secondary"}>
                    <BubbleContent>
                      <p className="whitespace-pre-wrap">{e.body}</p>
                    </BubbleContent>
                  </Bubble>
                  {e.attachments && e.attachments.length > 0 && (
                    <p className="mt-1 flex flex-wrap gap-1.5">
                      {e.attachments.map((a) => (
                        <AttachmentChip key={a.id} attachment={a} onOpen={() => onEntryClick?.(e)} />
                      ))}
                    </p>
                  )}
                  <MessageFooter className={e.direction === "out" ? "justify-end" : ""}>
                    <span className="clinic-num">{timeOf(e.at, i18n.language)}</span>
                    {e.status === "read" && <span>{t("clinic.msg.read", { time: timeOf(e.at, i18n.language) })}</span>}
                    {e.status === "delivered" && <span>{t("clinic.msg.delivered")}</span>}
                  </MessageFooter>
                </MessageContent>
              </Message>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function ThreadAttachmentsHint() {
  const { t } = useTranslation()
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-things-gray-3">
      <Paperclip className="size-3" aria-hidden="true" />
      {t("clinic.msg.attachments")}
    </span>
  )
}
