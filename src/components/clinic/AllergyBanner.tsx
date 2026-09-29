import { TriangleAlert, CircleCheck, CircleHelp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import type { AllergyRecord } from "./types"

/** The loudest thing on screen (04, Layer 2). Three states; not dismissible,
 * not collapsible, no animation. `no-known` is gray — never red. */
export function AllergyBanner({
  state,
  allergies,
  confirmedAt,
  onRecord,
  onReview,
  className,
}: {
  state: "has-allergies" | "no-known" | "none-recorded"
  allergies?: AllergyRecord[]
  confirmedAt?: string
  onRecord?: () => void
  onReview?: () => void
  className?: string
}) {
  const { t } = useTranslation()

  if (state === "has-allergies") {
    const inline = (allergies ?? []).slice(0, 2)
    const overflow = (allergies ?? []).length - inline.length
    return (
      <div
        className={cn(
          "flex w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-md bg-clinic-critical-soft px-3 py-2 text-sm",
          className,
        )}
        role="alert"
        data-allergy-state="has-allergies"
      >
        <span className="flex items-center gap-1.5 font-semibold text-clinic-critical">
          <TriangleAlert className="size-4" strokeWidth={2.2} aria-hidden="true" />
          {t("clinic.allergy.hasAllergies")}
        </span>
        <span className="flex flex-wrap items-center gap-x-2 text-clinic-critical">
          {inline.map((a) => (
            <span key={a.allergen}>
              {a.allergen}
              {a.reaction ? ` — ${a.reaction}` : ""}
            </span>
          ))}
          {overflow > 0 && (
            <HoverCard>
              <HoverCardTrigger className="cursor-default underline decoration-dotted">
                {t("clinic.common.more", { count: overflow })}
              </HoverCardTrigger>
              <HoverCardContent className="w-64">
                <ul className="flex flex-col gap-1 text-xs text-things-ink">
                  {(allergies ?? []).slice(2).map((a) => (
                    <li key={a.allergen}>
                      <span className="font-medium">{a.allergen}</span>
                      {a.reaction ? ` — ${a.reaction}` : ""}
                      {a.severity ? ` (${t(`clinic.allergy.severity.${a.severity}`)})` : ""}
                    </li>
                  ))}
                </ul>
              </HoverCardContent>
            </HoverCard>
          )}
          {onReview && (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-clinic-critical hover:bg-clinic-critical/10" onClick={onReview}>
              {t("clinic.allergy.review")}
            </Button>
          )}
        </span>
      </div>
    )
  }

  if (state === "no-known") {
    return (
      <div
        className={cn("flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-things-gray-3", className)}
        data-allergy-state="no-known"
      >
        <CircleCheck className="size-3.5" strokeWidth={2} aria-hidden="true" />
        {t("clinic.allergy.noKnown")}
        {confirmedAt && <span className="text-things-gray">{t("clinic.allergy.confirmedAt", { date: confirmedAt })}</span>}
        {onReview && (
          <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[11px] text-things-gray-3" onClick={onReview}>
            {t("clinic.allergy.review")}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-md border border-dashed border-clinic-warn px-3 py-1.5 text-xs",
        className,
      )}
      data-allergy-state="none-recorded"
    >
      <span className="flex items-center gap-1.5 font-medium text-clinic-warn">
        <CircleHelp className="size-3.5" strokeWidth={2} aria-hidden="true" />
        {t("clinic.allergy.notRecorded")}
      </span>
      {onRecord && (
        <Button variant="outline" size="sm" className="h-6 border-clinic-warn/40 px-2 text-xs text-clinic-warn hover:bg-clinic-warn-soft" onClick={onRecord}>
          {t("clinic.allergy.record")}
        </Button>
      )}
    </div>
  )
}
