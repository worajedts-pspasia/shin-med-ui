import { cn } from "@/lib/utils"

// BodyMap — the shared schematic front-body silhouette (Layer 9 support).
// BodyMapAnnotator and AnatomyInspector both render these named regions; the
// asset work, not the React, is the cost (04) — this schematic stands in
// until a designed SVG lands.

export interface BodyRegion {
  id: string
  label: string
  cx: number
  cy: number
  /** SVG shape in the 200×240 viewBox. */
  shape: React.ReactNode
}

const R = (x: number, y: number, w: number, h: number, rx = 8) => ({
  x, y, width: w, height: h, rx,
})

/** Ten named regions, viewer-relative labels (clinical left = viewer right). */
export const BODY_REGIONS: BodyRegion[] = [
  { id: "head", label: "Head", cx: 100, cy: 24, shape: <ellipse cx={100} cy={24} rx={16} ry={20} /> },
  { id: "neck", label: "Neck", cx: 100, cy: 47, shape: <rect {...R(92, 40, 16, 14, 4)} /> },
  { id: "chest", label: "Chest", cx: 100, cy: 74, shape: <rect {...R(72, 56, 56, 40, 10)} /> },
  { id: "abdomen", label: "Abdomen", cx: 100, cy: 112, shape: <rect {...R(78, 98, 44, 32, 8)} /> },
  { id: "pelvis", label: "Pelvis", cx: 100, cy: 140, shape: <rect {...R(80, 132, 40, 18, 6)} /> },
  { id: "arm-clinical-l", label: "Arm (clinical L)", cx: 56, cy: 66, shape: <rect {...R(38, 58, 32, 16, 8)} /> },
  { id: "forearm-clinical-l", label: "Forearm (clinical L)", cx: 46, cy: 92, shape: <rect {...R(32, 76, 26, 34, 8)} /> },
  { id: "arm-clinical-r", label: "Arm (clinical R)", cx: 144, cy: 66, shape: <rect {...R(130, 58, 32, 16, 8)} /> },
  { id: "forearm-clinical-r", label: "Forearm (clinical R)", cx: 154, cy: 92, shape: <rect {...R(142, 76, 26, 34, 8)} /> },
  { id: "thigh-clinical-l", label: "Thigh (clinical L)", cx: 80, cy: 172, shape: <rect {...R(66, 152, 28, 42, 10)} /> },
  { id: "shin-clinical-l", label: "Shin (clinical L)", cx: 80, cy: 214, shape: <rect {...R(68, 196, 24, 42, 8)} /> },
  { id: "thigh-clinical-r", label: "Thigh (clinical R)", cx: 120, cy: 172, shape: <rect {...R(106, 152, 28, 42, 10)} /> },
  { id: "shin-clinical-r", label: "Shin (clinical R)", cx: 120, cy: 214, shape: <rect {...R(108, 196, 24, 42, 8)} /> },
]

export function BodySilhouette({
  fill = "var(--color-things-hover)",
  fillOpacity = 1,
  stroke = "var(--color-things-hairline)",
  activeId,
  markedIds = [],
  onRegionClick,
  renderOverlays,
  className,
  svgClassName,
}: {
  fill?: string
  fillOpacity?: number
  stroke?: string
  activeId?: string
  markedIds?: string[]
  onRegionClick?: (id: string) => void
  /** Extra SVG per-region content (e.g. markers), drawn above the shapes. */
  renderOverlays?: (region: BodyRegion) => React.ReactNode
  className?: string
  svgClassName?: string
}) {
  return (
    <svg viewBox="0 0 200 240" role="img" className={cn("h-auto w-full", svgClassName)} data-slot="body-silhouette">
      {BODY_REGIONS.map((region) => {
        const marked = markedIds.includes(region.id)
        const active = region.id === activeId
        return (
          <g
            key={region.id}
            data-region={region.id}
            onClick={onRegionClick ? () => onRegionClick(region.id) : undefined}
            className={cn(onRegionClick && "cursor-pointer")}
          >
            {region.shape && (
              <g
                fill={marked || active ? "var(--color-things-select)" : fill}
                fillOpacity={marked || active ? 1 : fillOpacity}
                stroke={marked || active ? "var(--color-things-blue)" : stroke}
                strokeWidth={active || marked ? 2 : 1.25}
              >
                {region.shape}
              </g>
            )}
            {renderOverlays?.(region)}
          </g>
        )
      })}
    </svg>
  )
}

/** The ⊕ marker both annotator variants use (⊖ on hover via CSS). */
export function RegionMarker({ cx, cy, tone = "warn" }: { cx: number; cy: number; tone?: "warn" | "critical" | "ok" }) {
  const fillVar =
    tone === "critical" ? "var(--color-clinic-critical)" : tone === "ok" ? "var(--color-clinic-ok)" : "var(--color-clinic-warn)"
  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill={fillVar} />
      <g stroke="white" strokeWidth={2} strokeLinecap="round">
        <line x1={cx - 4} y1={cy} x2={cx + 4} y2={cy} />
        <line x1={cx} y1={cy - 4} x2={cx} y2={cy + 4} />
      </g>
    </g>
  )
}
