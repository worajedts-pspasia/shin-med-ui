import { useState } from "react"
import { ChevronDown, Pencil, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { MetaGrid } from "./MetaGrid"

// ProcedureEntryCard — the modern clinical record card (04, Layer 6;
// cardiology 1.jpg/2.jpg). The flagship pattern — the answer to "how do we
// rebuild the 2006 screens": one card per clinical act, coloured accent rail,
// meta grid, nested findings. Already a modern design in the source; we are
// adopting, not inventing. This is the shell of the exam-room card stack.

export function ProcedureEntryCard({
  kind,
  title,
  accent,
  glyph,
  meta,
  toggle,
  onEdit,
  onDelete,
  defaultOpen = true,
  children,
  className,
}: {
  kind: string
  title: React.ReactNode
  /** CSS var — the category rail colour. */
  accent: string
  glyph?: React.ReactNode
  meta?: Array<{ label: React.ReactNode; value: React.ReactNode; span?: 1 | 2 | 3 | 4; numeric?: boolean }>
  toggle?: { checked: boolean; onChange(v: boolean): void; label?: string }
  onEdit?(): void
  onDelete?(): void
  defaultOpen?: boolean
  children?: React.ReactNode
  className?: string
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section
      data-slot="procedure-entry-card"
      data-kind={kind}
      className={cn("overflow-hidden rounded-md border border-things-hairline bg-card", className)}
    >
      {/* accent rail — colour belongs to the category, never to severity */}
      <div className="flex border-l-4" style={{ borderLeftColor: accent }}>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left"
        >
          {glyph && <span className="shrink-0 text-things-gray-2">{glyph}</span>}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[10px] font-semibold uppercase tracking-wider text-things-gray-3">{kind}</span>
            <span className="block truncate text-sm font-semibold text-things-title">{title}</span>
          </span>
          <ChevronDown className={cn("size-4 shrink-0 text-things-gray-3 transition-transform", open && "rotate-180")} aria-hidden="true" />
        </button>
        {toggle && (
          <span className="flex shrink-0 items-center gap-1.5 pr-1">
            {toggle.label && <span className="text-[11px] text-things-gray-3">{toggle.label}</span>}
            <Switch checked={toggle.checked} onCheckedChange={toggle.onChange} aria-label={toggle.label ?? t(`clinic.card.toggle.${kind}`) ?? kind} />
          </span>
        )}
        <span className="flex shrink-0 items-center gap-0.5 pr-1.5">
          {onEdit && (
            <Button variant="ghost" size="icon-xs" aria-label={t("clinic.card.edit")} onClick={onEdit}>
              <Pencil aria-hidden="true" />
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="icon-xs" aria-label={t("clinic.card.delete")} className="text-clinic-critical" onClick={onDelete}>
              <Trash2 aria-hidden="true" />
            </Button>
          )}
        </span>
      </div>

      {open && (meta || children) && (
        <div className="flex flex-col gap-3 border-t border-things-hairline px-3 py-2.5">
          {meta && meta.length > 0 && <MetaGrid items={meta} />}
          {children}
        </div>
      )}
    </section>
  )
}
