import { FileText, UserSquare2, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// AttachmentChip — a reference to a file OR a clinical entity (04, Layer 7).
// This is what makes clinic messaging different from email: messages carry
// chart references, not just files. "Doc ID #1970: LabCorp Results.jpg" |
// "Chart #9562; Smith, Michael; Age: 46y". Chips wrap, truncate with tooltip.

export type AttachmentRef =
  | { id: string; kind: "file"; name: string; size?: string; docId?: string }
  | { id: string; kind: "chart"; chartId: string; patient: string; meta?: string }

export function AttachmentChip({
  attachment,
  onOpen,
  onRemove,
  className,
}: {
  attachment: AttachmentRef
  onOpen?(): void
  onRemove?(): void
  className?: string
}) {
  const { t } = useTranslation()
  const isFile = attachment.kind === "file"
  const label = isFile
    ? `${attachment.docId ? `Doc ID #${attachment.docId}: ` : ""}${attachment.name}`
    : `Chart #${attachment.chartId}; ${attachment.patient}`
  const title = isFile
    ? [label, attachment.size].filter(Boolean).join(" · ")
    : [label, attachment.meta].filter(Boolean).join(" · ")

  return (
    <TooltipProvider delayDuration={250}>
      <span
        data-slot="attachment-chip"
        data-attachment-kind={attachment.kind}
        className={cn(
          "inline-flex max-w-full items-center gap-1.5 rounded-md border border-things-tag-border bg-things-chip px-1.5 py-0.5 text-xs",
          onOpen && "cursor-pointer hover:bg-things-hover",
          className,
        )}
        onClick={onOpen}
      >
        {isFile ? (
          <FileText className="size-3.5 shrink-0 text-things-gray-2" aria-hidden="true" />
        ) : (
          <UserSquare2 className="size-3.5 shrink-0 text-things-blue" aria-hidden="true" />
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="min-w-0 truncate text-things-title" tabIndex={-1}>
              {label}
            </span>
          </TooltipTrigger>
          <TooltipContent>{title}</TooltipContent>
        </Tooltip>
        {!isFile && attachment.meta && <span className="hidden shrink-0 text-things-gray-3 sm:inline">{attachment.meta}</span>}
        {isFile && attachment.size && <span className="clinic-num shrink-0 text-things-gray-3">{attachment.size}</span>}
        {onRemove && (
          <button
            type="button"
            aria-label={t("clinic.msg.removeAttachment")}
            className="-mr-0.5 shrink-0 rounded-sm p-0.5 text-things-gray-3 hover:bg-things-hover hover:text-things-title"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        )}
      </span>
    </TooltipProvider>
  )
}
