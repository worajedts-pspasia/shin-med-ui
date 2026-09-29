import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

// NoteHistoryLog — append-only audit (04, Layer 5). Newest first; the
// timestamp is clinic-num gray-xs, the note wraps and is never truncated.
// Consumed by ProblemTable and AuditFooter.history.

export interface NoteHistoryEntry {
  id: string
  at: string
  author: string
  note: string
}

export function NoteHistoryLog({
  entries,
  reverse = false,
  emptyLabel,
  className,
}: {
  /** Newest-first is the expected input order; `reverse` flips to oldest-first. */
  entries: NoteHistoryEntry[]
  reverse?: boolean
  emptyLabel?: string
  className?: string
}) {
  const { t } = useTranslation()
  const rows = reverse ? [...entries].reverse() : entries
  return (
    <div
      data-slot="note-history-log"
      className={cn("overflow-hidden rounded-md border border-things-hairline bg-card", className)}
    >
      <table className="w-full border-collapse text-sm">
        <tbody className="divide-y divide-things-hairline">
          {rows.map((e) => (
            <tr key={e.id} data-entry={e.id} className="align-top">
              <td className="clinic-num w-36 whitespace-nowrap px-3 py-2 text-xs text-things-gray-2">
                {e.at}
              </td>
              <td className="w-32 whitespace-nowrap px-3 py-2 text-xs font-medium text-things-title">
                {e.author}
              </td>
              <td className="px-3 py-2 text-things-ink [overflow-wrap:anywhere]">{e.note}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={3} className="px-3 py-6 text-center text-sm text-things-gray-3">
                {emptyLabel ?? t("clinic.notehistory.empty")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
