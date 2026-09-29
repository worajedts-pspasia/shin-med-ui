import { TriangleAlert } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { MetaGrid } from "./MetaGrid"
import { PaperSurface } from "./PaperSurface"
import { PatientName } from "./PatientName"
import type { NameParts } from "./types"

// PrescriptionPreview — the Rx as it will print (04, Layer 7;
// EHR-ePrescribing). Prescriber block, patient block, drug/sig/dispense/
// refills/void/diagnosis via MetaGrid, footer actions (Coverage · Save ·
// Print · Send). interactionsVerified=false renders a faint warning-triangle
// watermark + amber "Interactions pending" badge. Send is irreversible —
// alert-dialog. Fixed paper-like max-width (~420px): centers on wide screens,
// fills width on narrow — the paper metaphor never reflows.

export interface RxData {
  drug: string
  sig: string
  dispense: string
  refills: string
  voidUntil?: string
  diagnosis?: string
}

export function PrescriptionPreview({
  rx,
  patient,
  prescriber,
  pharmacy,
  interactionsVerified = true,
  onSend,
  actions,
  className,
}: {
  rx: RxData
  patient: { name: NameParts; dob: string; mrn: string }
  prescriber: { doctor: string; clinic: string; license: string }
  pharmacy: { name: string; address?: string }
  interactionsVerified?: boolean
  /** Irreversible — confirm dialog is mandatory. */
  onSend?(): void
  /** Extra footer actions rendered before Send (Coverage · Save · Print). */
  actions?: Array<{ label: string; onSelect(): void; variant?: "ghost" | "outline" }>
  className?: string
}) {
  const { t } = useTranslation()
  const pending = !interactionsVerified

  return (
    <div data-slot="prescription-preview" className={cn("mx-auto flex w-full max-w-[420px] flex-col gap-2", className)}>
      {pending && (
        <p className="flex items-center justify-center gap-1.5 rounded-md border border-clinic-warn/30 bg-clinic-warn-soft px-2 py-1 text-xs font-medium text-clinic-warn">
          <TriangleAlert className="size-3.5" aria-hidden="true" />
          {t("clinic.rx.interactionsPending")}
        </p>
      )}
      <PaperSurface
        size="auto"
        serif
        watermark={pending ? { icon: TriangleAlert, label: t("clinic.rx.pendingWatermark") } : undefined}
        className="[&>div]:w-full"
      >
        <div className="flex flex-col gap-3 p-4 text-[13px] leading-snug">
          {/* prescriber block */}
          <div className="border-b border-dashed border-clinic-paper-edge pb-2">
            <p className="text-sm font-bold">{prescriber.clinic}</p>
            <p className="mt-1">
              {t("clinic.rx.rxSymbol")} — {prescriber.doctor} · {t("clinic.rx.license")} {prescriber.license}
            </p>
          </div>

          {/* patient block */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <span className="font-semibold">
              <PatientName parts={patient.name} />
            </span>
            <span className="clinic-num">{patient.dob}</span>
            <span className="font-mono">{patient.mrn}</span>
          </div>

          {/* the order itself */}
          <MetaGrid
            columns={2}
            items={[
              { label: t("clinic.rx.drug"), value: <span className="font-semibold">{rx.drug}</span> },
              { label: t("clinic.rx.sig"), value: <span className="font-mono text-xs">{rx.sig}</span>, span: 1 },
              { label: t("clinic.rx.dispense"), value: rx.dispense },
              { label: t("clinic.rx.refills"), value: rx.refills },
              ...(rx.voidUntil ? [{ label: t("clinic.rx.voidUntil"), value: rx.voidUntil }] : []),
              ...(rx.diagnosis ? [{ label: t("clinic.rx.diagnosis"), value: rx.diagnosis, span: 2 as const }] : []),
            ]}
          />

          {/* pharmacy + signature line */}
          <div className="mt-1 flex items-end justify-between gap-3 border-t border-dashed border-clinic-paper-edge pt-2">
            <p className="text-xs">
              {t("clinic.rx.to")}: {pharmacy.name}
              {pharmacy.address && <span className="block text-clinic-paper-ink/70">{pharmacy.address}</span>}
            </p>
            <span className="clinic-num shrink-0 text-[10px] text-clinic-paper-ink/60">{t("clinic.rx.sigLine")}</span>
          </div>
        </div>
      </PaperSurface>

      {/* footer actions — app chrome, not paper */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        {actions?.map((a) => (
          <Button key={a.label} variant={a.variant ?? "ghost"} size="sm" onClick={a.onSelect}>
            {a.label}
          </Button>
        ))}
        {onSend && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" disabled={pending}>
                {t("clinic.rx.send")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("clinic.rx.sendTitle")}</AlertDialogTitle>
                <AlertDialogDescription>{t("clinic.rx.sendDesc")}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("clinic.form.cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={onSend}>{t("clinic.rx.sendConfirm")}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}
