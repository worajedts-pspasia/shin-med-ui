import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

// LabFishbone — the CHEM-7 / CBC skeleton diagram (04, Layer 9; EHR Vitals
// Analysis). Beloved by clinicians, meaningless to anyone else — ResultTable
// is the accessible default; this is the alternate view. Desktop-only (lg+).

type Flag = "H" | "HH" | "L" | "LL" | undefined

export interface FishboneValue {
  value: string
  flag?: Flag
}

interface Bone {
  key: string
  label: string
  unit?: string
  x: number
  dir: "up" | "down"
}

const CHEM7: Bone[] = [
  { key: "na", label: "Na", unit: "mEq/L", x: 90, dir: "up" },
  { key: "k", label: "K", unit: "mEq/L", x: 170, dir: "up" },
  { key: "bun", label: "BUN", unit: "mg/dL", x: 250, dir: "up" },
  { key: "cr", label: "Cr", unit: "mg/dL", x: 330, dir: "up" },
  { key: "cl", label: "Cl", unit: "mEq/L", x: 90, dir: "down" },
  { key: "hco3", label: "HCO₃", unit: "mEq/L", x: 170, dir: "down" },
  { key: "glu", label: "Glu", unit: "mg/dL", x: 250, dir: "down" },
]

const CBC: Bone[] = [
  { key: "wbc", label: "WBC", unit: "K/µL", x: 110, dir: "up" },
  { key: "hgb", label: "Hgb", unit: "g/dL", x: 230, dir: "up" },
  { key: "hct", label: "Hct", unit: "%", x: 350, dir: "up" },
  { key: "plt", label: "Plt", unit: "K/µL", x: 170, dir: "down" },
]

const FLAG_FILL: Record<Exclude<Flag, undefined>, string> = {
  H: "var(--color-clinic-warn)",
  L: "var(--color-clinic-warn)",
  HH: "var(--color-clinic-critical)",
  LL: "var(--color-clinic-critical)",
}

export function LabFishbone({
  panel,
  values,
  className,
}: {
  panel: "chem7" | "cbc"
  values: Record<string, FishboneValue>
  className?: string
}) {
  const { t } = useTranslation()
  const bones = panel === "chem7" ? CHEM7 : CBC
  const spineY = 120
  const tip = (dir: Bone["dir"]) => (dir === "up" ? spineY - 62 : spineY + 62)

  return (
    <div
      data-slot="lab-fishbone"
      data-panel={panel}
      className={cn("overflow-hidden rounded-md border border-things-hairline bg-card", className)}
    >
      <div className="hidden lg:block p-4">
        <svg viewBox="0 0 440 240" className="h-auto w-full" role="img" aria-label={t(`clinic.fishbone.${panel}`)}>
          {/* spine */}
          <line x1={40} y1={spineY} x2={420} y2={spineY} stroke="var(--color-things-gray-3)" strokeWidth={2.5} strokeLinecap="round" />
          {bones.map((b) => {
            const v = values[b.key]
            const y1 = tip(b.dir)
            const labelY = b.dir === "up" ? y1 - 26 : y1 + 34
            const unitY = b.dir === "up" ? y1 - 12 : y1 + 46
            return (
              <g key={b.key}>
                <line x1={b.x} y1={spineY} x2={b.x} y2={y1} stroke="var(--color-things-gray-3)" strokeWidth={2} />
                <text
                  x={b.x}
                  y={b.dir === "up" ? y1 - 40 : y1 + 60}
                  textAnchor="middle"
                  fontSize={13}
                  fill="var(--color-things-gray-2)"
                >
                  {b.label}
                </text>
                <text
                  data-bone={b.key}
                  x={b.x}
                  y={labelY}
                  textAnchor="middle"
                  fontSize={20}
                  fontWeight={600}
                  fill={v?.flag ? FLAG_FILL[v.flag] : "var(--color-things-ink)"}
                >
                  {v?.value ?? "—"}
                </text>
                {b.unit && (
                  <text x={b.x} y={unitY} textAnchor="middle" fontSize={10} fill="var(--color-things-gray-3)">
                    {b.unit}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
      <div className="p-3 lg:hidden">
        <p className="text-xs text-things-gray-3">{t("clinic.fishbone.desktopOnly")}</p>
      </div>
    </div>
  )
}
