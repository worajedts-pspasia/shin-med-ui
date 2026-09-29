import { Loader2, Trash2, TriangleAlert } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CodedSearchInput } from "./CodedSearchInput"
import { OrderSetButtons, type OrderSet } from "./OrderSetButtons"
import { SigBuilder } from "./SigBuilder"
import type { CodedConcept } from "./types"

// OrderEntryForm — the drug / lab / imaging / procedure order row (04,
// Layer 6; 02.2/02.3/02.4 are structurally identical): a coded item +
// parameters + qty + save/delete + an order-set pair. The lab mode KEEPS
// criticalValue — a safety field, rendered clinic-critical with a red
// tooltip. showCost is a deliberate Thai-market accommodation (ทุน on the
// clinical row). Fields stack to 1 column below md; the range pair stays
// side-by-side.

export interface OrderDraft {
  concept?: CodedConcept
  qty?: string
  days?: string
  sig?: string
  normalMin?: string
  normalMax?: string
  criticalValue?: string
  cost?: string
}

export function OrderEntryForm({
  kind,
  value,
  onChange,
  onSave,
  onDelete,
  search,
  orderSets,
  onApplySet,
  onSaveSet,
  showCost = false,
  relatedProblems,
  saving = false,
  className,
}: {
  kind: "drug" | "lab" | "imaging" | "procedure"
  value: OrderDraft
  onChange(o: OrderDraft): void
  onSave(): void
  onDelete?(): void
  search: (q: string) => Promise<CodedConcept[]>
  orderSets?: OrderSet[]
  onApplySet?(set: OrderSet): void
  onSaveSet?(): void
  showCost?: boolean
  relatedProblems?: string[]
  saving?: boolean
  className?: string
}) {
  const { t } = useTranslation()

  const system = kind === "drug" ? "drug" : kind === "lab" ? "lab" : kind === "imaging" ? "cpt" : "cpt"

  return (
    <TooltipProvider delayDuration={150}>
      <div data-slot="order-entry-form" data-kind={kind} className={cn("flex flex-col gap-3", className)}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field>
            <FieldLabel>{t(`clinic.order.kind.${kind}`)}</FieldLabel>
            <CodedSearchInput<CodedConcept>
              system={system}
              value={value.concept}
              onSelect={(concept) => onChange({ ...value, concept })}
              search={search}
            />
          </Field>

          {kind === "drug" && (
            <>
              <Field>
                <FieldLabel>{t("clinic.order.indication")}</FieldLabel>
                <NativeSelect defaultValue="" className="text-sm">
                  <option value="" />
                  {(relatedProblems ?? []).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <div className="col-span-full">
                <SigBuilder
                  directionCodes={SIG_CODES}
                  value={value.sig ?? ""}
                  onChange={(sig) => onChange({ ...value, sig })}
                />
              </div>
              <Field>
                <FieldLabel>{t("clinic.order.qty")}</FieldLabel>
                <Input className="clinic-num h-8 text-sm" defaultValue={value.qty} onChange={(e) => onChange({ ...value, qty: e.target.value })} />
              </Field>
              <Field>
                <FieldLabel>{t("clinic.order.days")}</FieldLabel>
                <Input className="clinic-num h-8 text-sm" defaultValue={value.days} onChange={(e) => onChange({ ...value, days: e.target.value })} />
              </Field>
            </>
          )}

          {kind === "lab" && (
            <>
              <Field>
                <FieldLabel>{t("clinic.order.normalRange")}</FieldLabel>
                {/* the pair stays side-by-side at every size (04) */}
                <span className="flex items-center gap-1.5">
                  <Input aria-label={t("clinic.order.min")} className="clinic-num h-8 text-sm" defaultValue={value.normalMin} onChange={(e) => onChange({ ...value, normalMin: e.target.value })} />
                  <span className="text-xs text-things-gray-3">{t("clinic.order.to")}</span>
                  <Input aria-label={t("clinic.order.max")} className="clinic-num h-8 text-sm" defaultValue={value.normalMax} onChange={(e) => onChange({ ...value, normalMax: e.target.value })} />
                </span>
              </Field>
              <Field>
                <FieldLabel className="flex items-center gap-1">
                  <span className="text-clinic-critical">{t("clinic.order.criticalValue")}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TriangleAlert className="size-3.5 cursor-help text-clinic-critical" tabIndex={0} aria-label={t("clinic.order.criticalHint")} />
                    </TooltipTrigger>
                    <TooltipContent className="border-clinic-critical/30 text-clinic-critical">{t("clinic.order.criticalHint")}</TooltipContent>
                  </Tooltip>
                </FieldLabel>
                <Input className="clinic-num h-8 text-sm text-clinic-critical" defaultValue={value.criticalValue} onChange={(e) => onChange({ ...value, criticalValue: e.target.value })} />
              </Field>
              {relatedProblems && relatedProblems.length > 0 && (
                <Field className="col-span-full">
                  <FieldLabel>{t("clinic.order.relatedProblems")}</FieldLabel>
                  <NativeSelect defaultValue="" className="text-sm">
                    <option value="" />
                    {relatedProblems.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
              )}
            </>
          )}

          {showCost && (
            <Field>
              <FieldLabel>{t("clinic.order.cost")}</FieldLabel>
              <Input className="clinic-num h-8 text-sm" defaultValue={value.cost} onChange={(e) => onChange({ ...value, cost: e.target.value })} />
            </Field>
          )}

          {kind === "imaging" && (
            <Field>
              <FieldLabel>{t("clinic.order.modality")}</FieldLabel>
              <NativeSelect defaultValue="" className="text-sm">
                <option value="" />
                <option>X-ray</option>
                <option>CT</option>
                <option>MRI</option>
                <option>Ultrasound</option>
              </NativeSelect>
            </Field>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-things-hairline pt-2">
          {orderSets && orderSets.length > 0 && (
            <OrderSetButtons sets={orderSets} onApply={(s) => onApplySet?.(s)} onSaveCurrent={onSaveSet} />
          )}
          <span className="ml-auto flex items-center gap-2">
            {onDelete && (
              <Button variant="outline" size="sm" className="text-clinic-critical" onClick={onDelete}>
                <Trash2 aria-hidden="true" />
                {t("clinic.order.delete")}
              </Button>
            )}
            <Button size="sm" onClick={onSave} disabled={saving || !value.concept}>
              {saving && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {t("clinic.order.save")}
            </Button>
          </span>
        </div>
      </div>
    </TooltipProvider>
  )
}

const SIG_CODES = [
  { code: "1-0-0", sig: "1 tab before breakfast" },
  { code: "1-0-1", sig: "1 tab morning and evening" },
  { code: "0-0-1", sig: "1 tablet at bedtime" },
  { code: "1 Q Day", sig: "1 Q Day" },
  { code: "Apply bid", sig: "Apply bid" },
]
