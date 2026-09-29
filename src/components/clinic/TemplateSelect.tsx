import { Sparkles } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// TemplateSelect + GeneratedSummaryPanel — template-driven documentation
// (04, Layer 6). The narrative is derived, never typed: every structured
// field renders as an underlined link back to the control that produced it,
// so prose and form can never drift apart. Useless apart, so one file.

export function TemplateSelect({
  templates,
  value,
  onSelect,
  className,
  ariaLabel,
}: {
  templates: { id: string; label: string }[]
  value?: string
  onSelect: (id: string) => void
  className?: string
  ariaLabel?: string
}) {
  const { t } = useTranslation()
  return (
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger className={cn("w-full sm:w-64", className)} aria-label={ariaLabel ?? t("clinic.template.select")}>
        <SelectValue placeholder={t("clinic.template.placeholder")} />
      </SelectTrigger>
      <SelectContent>
        {templates.map((tpl) => (
          <SelectItem key={tpl.id} value={tpl.id}>
            {tpl.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export interface SummarySegment {
  id: string
  text: string
  /** Present when this sentence fragment came from a structured control. */
  controlId?: string
}

export function GeneratedSummaryPanel({
  templateLabel,
  segments,
  onJump,
  maxHeight = 260,
  className,
}: {
  templateLabel?: string
  segments: SummarySegment[]
  /** "Jump" to the control behind an underlined fragment. */
  onJump?: (controlId: string) => void
  maxHeight?: number
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <div
      data-slot="generated-summary-panel"
      className={cn("overflow-hidden rounded-md border border-things-hairline bg-card", className)}
    >
      <div className="flex items-center justify-between gap-2 border-b border-things-hairline px-3 py-2">
        <span className="truncate text-sm font-medium text-things-title">
          {templateLabel ?? t("clinic.template.none")}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-things-blue-soft px-2 py-0.5 text-[11px] font-medium text-things-blue">
          <Sparkles className="size-3" aria-hidden="true" />
          {t("clinic.template.generated")}
        </span>
      </div>
      <ScrollArea style={{ maxHeight }}>
        <p data-slot="summary-text" className="px-3 py-3 text-sm leading-6 text-things-ink">
          {segments.map((s) =>
            s.controlId ? (
              <button
                key={s.id}
                type="button"
                data-control-link={s.controlId}
                title={t("clinic.template.jump")}
                onClick={() => { if (s.controlId) onJump?.(s.controlId) }}
                className="underline decoration-things-blue/60 decoration-2 underline-offset-4 transition-colors hover:text-things-blue focus-visible:outline-2 focus-visible:outline-things-blue"
              >
                {s.text}
              </button>
            ) : (
              <span key={s.id}>{s.text}</span>
            ),
          )}
        </p>
      </ScrollArea>
    </div>
  )
}
