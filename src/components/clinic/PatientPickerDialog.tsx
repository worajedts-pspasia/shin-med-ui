import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DataTable } from "./DataTable"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { PatientName } from "./PatientName"
import { useIsMobile } from "@/hooks/use-mobile"
import type { PatientIdentity } from "./types"

// PatientPickerDialog — the escalation from the combobox when the result set
// is large or needs comparison (04, Layer 2; 01.2 ค้นประวัติ). Full-row
// selection, Enter confirms, Esc cancels, Select disabled until a row is
// chosen. Below md: full-screen Sheet. Generic enough to serve as the
// find-entity dialog for other coded lookups.

export function PatientPickerDialog({
  open,
  onOpenChange,
  results,
  onSelect,
  title,
  className,
}: {
  open: boolean
  onOpenChange(v: boolean): void
  results: PatientIdentity[]
  onSelect(patient: PatientIdentity): void
  title?: string
  className?: string
}) {
  const { t, i18n } = useTranslation()
  const isMobile = useIsMobile()
  const [selectedId, setSelectedId] = useState<string>()

  useEffect(() => {
    if (!open) setSelectedId(undefined)
  }, [open])

  const selected = useMemo(() => results.find((r) => r.id === selectedId), [results, selectedId])

  const confirm = () => {
    if (selected) {
      onSelect(selected)
      onOpenChange(false)
    }
  }

  const dob = (iso: string) => new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(iso))

  // min-w-0 on the grid item: DialogContent is a grid, and grid items default
  // to min-width:auto — without it the table's intrinsic min-content width
  // overflows the capped dialog instead of scrolling inside it
  const table = (
    <div data-density={isMobile ? "compact" : "comfortable"} className="min-w-0">
    <DataTable<PatientIdentity>
      className={className}
      columns={[
        {
          id: "name", header: t("clinic.queue.name"), width: 180, sticky: "start",
          cell: (r) => (
            <button type="button" onClick={() => setSelectedId(r.id)} className="text-left hover:underline">
              <PatientName parts={r.name} />
            </button>
          ),
        },
        { id: "dob", header: t("clinic.patient.dob"), width: 120, cell: (r) => <span className="clinic-num text-xs text-things-gray-2">{dob(r.dob)}</span> },
        { id: "sex", header: t("clinic.patient.sex"), width: 70, priority: "secondary", cell: (r) => t(`clinic.patient.sexLabel.${r.sex}`) },
        { id: "mrn", header: t("clinic.patient.mrn"), width: 80, numeric: true, cell: (r) => <span className="font-mono text-xs">{r.mrn}</span> },
      ]}
      rows={results}
      rowKey={(r) => r.id}
      selected={selectedId ? [selectedId] : undefined}
      onSelect={(id) => setSelectedId(id)}
      maxHeight={isMobile ? "60vh" : 340}
    />
    </div>
  )

  const footer = (
    <>
      <Button variant="ghost" onClick={() => onOpenChange(false)}>
        {t("clinic.form.cancel")}
      </Button>
      <Button disabled={!selected} onClick={confirm}>
        {t("clinic.picker.select")}
      </Button>
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="flex h-[92vh] flex-col p-0">
          <SheetHeader className="px-4 pt-4">
            <SheetTitle>{title ?? t("clinic.picker.title")}</SheetTitle>
            <SheetDescription className="sr-only">{t("clinic.picker.title")}</SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">{table}</div>
          <SheetFooter className="flex-row justify-end gap-2 px-4 pb-4">{footer}</SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* w-auto: the dialog grows with the table's natural width instead of
          squeezing it; max-w 80vw is the ceiling, past which the table
          scrolls internally (min-w-0 above) with the sticky name column */}
      {/* the base left-50%/translate centering caps shrink-to-fit at the
          RIGHT half of the viewport (available = viewport - left); inset-x-0
          + mx-auto + translate-x-0 lets the dialog see the full width and
          grow with the table, capped at 80vw */}
      <DialogContent
        className={cn("inset-x-0 mx-auto w-[80vw] max-w-[80vw] translate-x-0 sm:max-w-[80vw]", className)}
      >
        <DialogHeader>
          <DialogTitle>{title ?? t("clinic.picker.title")}</DialogTitle>
          <DialogDescription>
            <span className="clinic-num">{t("clinic.picker.count", { count: results.length })}</span>
          </DialogDescription>
        </DialogHeader>
        {table}
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
