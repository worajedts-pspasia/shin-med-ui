import { TriangleAlert } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// VitalsStrip — the compact editable vitals row (04, Layer 3; 02.1
// BW/H/BP/Pulse/BMI/IBW). Wraps below md, never scrolls horizontally — these
// are inputs. Unknown renders "—", never an empty box. BP is always ONE cell.
// Derived fields (BMI/IBW) are computed: muted background, not editable — the
// source tints them yellow and lets you type into them, which invites
// inconsistency.

export type VitalKey = "bw" | "h" | "bp" | "pulse" | "temp" | "bmi" | "ibw" | "bsa" | "resp" | "spo2" | "pain"

export interface VitalCell {
  key: VitalKey
  label?: string
  value?: string | [string, string]
  unit?: string
  takenAt?: string
  abnormal?: boolean
}

export function VitalsStrip({
  cells,
  chiefComplaint,
  editable = true,
  onChange,
  className,
}: {
  cells: VitalCell[]
  chiefComplaint?: string
  editable?: boolean
  onChange?: (key: VitalKey, value: string | [string, string]) => void
  className?: string
}) {
  const { t } = useTranslation()

  return (
    <TooltipProvider delayDuration={200}>
      <div data-slot="vitals-strip" className={cn("flex flex-col gap-2", className)}>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {cells.map((c) => {
            const raw = Array.isArray(c.value) ? c.value.join("/") : c.value
            const label = c.label ?? c.key.toUpperCase()
            const derived = c.key === "bmi" || c.key === "ibw" || c.key === "bsa"
            return (
              <div key={c.key} className="flex flex-col gap-1">
                <label
                  htmlFor={`vitals-${c.key}`}
                  className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-things-gray-3"
                >
                  {label}
                  {derived && <span className="font-normal normal-case text-things-gray-3/80">({t("clinic.vitals.derived")})</span>}
                </label>
                <div className="flex items-center gap-1">
                  {editable && !derived ? (
                    <Input
                      id={`vitals-${c.key}`}
                      defaultValue={raw}
                      placeholder={raw === undefined ? "—" : undefined}
                      aria-label={label}
                      inputMode={c.key === "bp" ? "text" : "decimal"}
                      className={cn(
                        "clinic-num h-8 px-2 text-sm",
                        c.abnormal && "border-clinic-critical/40 text-clinic-critical focus-visible:ring-clinic-critical/25",
                      )}
                      onChange={(e) => {
                        const v = e.target.value
                        if (c.key === "bp" && v.includes("/")) {
                          const [sys, dia] = v.split("/")
                          onChange?.(c.key, [sys.trim(), dia.trim()])
                        } else {
                          onChange?.(c.key, v)
                        }
                      }}
                    />
                  ) : (
                    <span
                      className={cn(
                        "clinic-num flex h-8 min-w-0 flex-1 items-center rounded-md border border-transparent px-2 text-sm",
                        derived ? "bg-clinic-lane text-things-gray-2" : "text-things-title",
                        c.abnormal && "text-clinic-critical",
                      )}
                    >
                      {raw ?? "—"}
                      {raw !== undefined && c.unit && <span className="ml-1 text-[11px] font-normal text-things-gray-3">{c.unit}</span>}
                    </span>
                  )}
                  {c.abnormal && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TriangleAlert className="size-3.5 shrink-0 text-clinic-critical" aria-label={t("clinic.vitals.abnormal")} />
                      </TooltipTrigger>
                      <TooltipContent>{t("clinic.vitals.abnormal")}</TooltipContent>
                    </Tooltip>
                  )}
                </div>
                {c.takenAt && <span className="clinic-num text-[10px] text-things-gray-3">{c.takenAt}</span>}
              </div>
            )
          })}
        </div>
        {chiefComplaint !== undefined && (
          <div className="flex items-center gap-2 border-t border-things-hairline pt-2">
            <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-things-gray-3">{t("clinic.vitals.cc")}</span>
            {editable ? (
              <Input
                aria-label={t("clinic.vitals.cc")}
                defaultValue={chiefComplaint}
                className="h-8 flex-1 border-transparent px-1 text-sm shadow-none focus-visible:ring-0"
              />
            ) : (
              <span className="flex-1 truncate text-sm text-things-title">{chiefComplaint}</span>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
