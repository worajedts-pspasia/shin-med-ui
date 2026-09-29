import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// FormActionBar — the bottom form action row (04, Layer 7; source 01.1:
// เพิ่มใหม่ / แก้ไข / บันทึก / ยกเลิก / ปิด-Esc). Enforces the separation rule
// (02 §4.4): primary right, destructive segregated behind a confirm, Esc =
// cancel, Cmd/Ctrl+S = save. Sticky at the bottom of a scrolling form; shows
// an unsaved-changes marker — the sources' dirty states are invisible.

export interface FormActionBarProps {
  primary: { label: string; onSelect: () => void; disabled?: boolean; reason?: string }
  secondary?: Array<{ label: string; onSelect: () => void }>
  destructive?: { label: string; confirmLabel: string; onConfirm: () => void }
  dirty?: boolean
  saving?: boolean
  /** Esc / Cmd+S key handling (default true). */
  shortcuts?: boolean
  /** Esc target — usually the cancel action. */
  onCancel?: () => void
  className?: string
}

export function FormActionBar({
  primary,
  secondary,
  destructive,
  dirty = false,
  saving = false,
  shortcuts = true,
  onCancel,
  className,
}: FormActionBarProps) {
  const { t } = useTranslation()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const primaryDisabled = saving || primary.disabled

  useEffect(() => {
    if (!shortcuts) return
    const onKey = (e: KeyboardEvent) => {
      if (saving) return
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault()
        if (!primaryDisabled) primary.onSelect()
      } else if (e.key === "Escape") {
        onCancel?.()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [shortcuts, saving, primaryDisabled, primary, onCancel])

  const primaryBtn = (
    <Button onClick={primary.onSelect} disabled={primaryDisabled} data-saving={saving ? "" : undefined}>
      {saving && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {saving ? t("clinic.form.saving") : primary.label}
    </Button>
  )

  return (
    <div
      data-slot="form-action-bar"
      data-dirty={dirty ? "" : undefined}
      role="group"
      aria-label={t("clinic.form.actions")}
      className={cn(
        "sticky bottom-0 flex flex-wrap items-center gap-2 border-t border-things-hairline bg-background/95 px-3 py-2 backdrop-blur",
        className,
      )}
    >
      {/* unsaved marker — gold flow tone; dirty is a state, not a severity */}
      <span className="mr-auto flex items-center gap-1.5 pl-0.5 text-xs text-things-gray-2">
        {dirty && (
          <>
            <span className="inline-block size-1.5 rounded-full bg-things-gold" aria-hidden="true" />
            {t("clinic.form.unsaved")}
          </>
        )}
      </span>

      {onCancel && (
        <kbd className="hidden rounded border border-things-hairline bg-card px-1 py-0.5 text-[10px] text-things-gray-3 md:inline-block">
          Esc
        </kbd>
      )}

      <TooltipProvider delayDuration={200}>
        {destructive && (
          <Popover open={confirmOpen} onOpenChange={setConfirmOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="text-clinic-critical">
                {destructive.label}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="end">
              <p className="mb-2 max-w-56 text-sm text-things-title">{destructive.confirmLabel}</p>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(false)}>
                  {t("clinic.form.cancel")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setConfirmOpen(false)
                    destructive.onConfirm()
                  }}
                >
                  {t("clinic.form.confirm")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {secondary?.map((s) => (
          <Button key={s.label} variant="ghost" onClick={s.onSelect}>
            {s.label}
          </Button>
        ))}

        {/* disabled primary explains itself */}
        {primaryDisabled && primary.reason ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0}>{primaryBtn}</span>
            </TooltipTrigger>
            <TooltipContent>{primary.reason}</TooltipContent>
          </Tooltip>
        ) : (
          primaryBtn
        )}
      </TooltipProvider>
    </div>
  )
}
