import { useState } from "react"
import { FileClock } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { NoteHistoryLog, type NoteHistoryEntry } from "./NoteHistoryLog"

// AuditFooter — who / when (04, Layer 7). Every clinical record shows its
// provenance without a click; the HoverCard adds created/modified/revision,
// and `history` opens the full NoteHistoryLog in a dialog.

const stamp = (iso: string, lang: string) =>
  new Intl.DateTimeFormat(lang, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(iso))

export function AuditFooter({
  createdBy,
  createdAt,
  modifiedBy,
  modifiedAt,
  revision,
  history,
  className,
}: {
  createdBy: string
  createdAt: string
  modifiedBy?: string
  modifiedAt?: string
  revision?: number
  history?: NoteHistoryEntry[]
  className?: string
}) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const line = modifiedAt
    ? t("clinic.audit.modified", {
        at: stamp(modifiedAt, i18n.language),
        name: modifiedBy ?? createdBy,
      })
    : t("clinic.audit.created", { at: stamp(createdAt, i18n.language), name: createdBy })

  return (
    <>
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            data-slot="audit-footer"
            className={cn(
              "inline-flex items-center gap-1.5 text-xs text-things-gray-2 transition-colors hover:text-things-title focus-visible:outline-2 focus-visible:outline-things-blue",
              className,
            )}
          >
            {line}
          </button>
        </HoverCardTrigger>
        <HoverCardContent side="top" className="w-72 text-xs">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
            <dt className="text-things-gray-2">{t("clinic.audit.createdLabel")}</dt>
            <dd className="clinic-num text-things-title">
              {stamp(createdAt, i18n.language)} — {createdBy}
            </dd>
            {modifiedAt && (
              <>
                <dt className="text-things-gray-2">{t("clinic.audit.modifiedLabel")}</dt>
                <dd className="clinic-num text-things-title">
                  {stamp(modifiedAt, i18n.language)} — {modifiedBy ?? createdBy}
                </dd>
              </>
            )}
            {revision !== undefined && (
              <>
                <dt className="text-things-gray-2">{t("clinic.audit.revision")}</dt>
                <dd className="clinic-num text-things-title">{revision}</dd>
              </>
            )}
          </dl>
          {history && history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => setOpen(true)}
            >
              <FileClock className="size-3.5" aria-hidden="true" />
              {t("clinic.audit.viewHistory")}
            </Button>
          )}
        </HoverCardContent>
      </HoverCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("clinic.audit.historyTitle")}</DialogTitle>
            <DialogDescription>{t("clinic.audit.historyDesc")}</DialogDescription>
          </DialogHeader>
          <NoteHistoryLog entries={history ?? []} className="max-h-[50vh] overflow-y-auto" />
        </DialogContent>
      </Dialog>
    </>
  )
}
