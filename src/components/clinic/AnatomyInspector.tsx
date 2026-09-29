import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { BodySilhouette } from "./BodyMap"

// AnatomyInspector — cardiology vessel navigator (04, Layer 9): body
// silhouette + zoom box + Arterial/Venous segmented control + region list.
// Pairs with BodyMapAnnotator. Desktop-only. The two mode tints are
// decorative map keys, not data channels — labelled by the control itself.

export type AnatomyMode = "arterial" | "venous"

export interface AnatomyRegion {
  id: string
  label: string
  cx: number
  cy: number
}

const MODE_FILL: Record<AnatomyMode, string> = {
  arterial: "var(--color-things-cal)",
  venous: "var(--color-things-teal)",
}

const ZOOM = 3
const BOX = 160 // zoom-box px (size-40)

export function AnatomyInspector({
  regions,
  mode = "arterial",
  onMode,
  selectedId,
  onSelect,
  className,
}: {
  regions: AnatomyRegion[]
  mode?: AnatomyMode
  onMode?: (m: AnatomyMode) => void
  selectedId?: string
  onSelect?: (id: string) => void
  className?: string
}) {
  const { t } = useTranslation()
  const selected = regions.find((r) => r.id === selectedId)

  return (
    <div
      data-slot="anatomy-inspector"
      data-mode={mode}
      className={cn("overflow-hidden rounded-md border border-things-hairline bg-card", className)}
    >
      <div className="flex items-center justify-between gap-2 border-b border-things-hairline px-3 py-2">
        <span className="text-sm font-medium text-things-title">{t("clinic.anatomy.title")}</span>
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(v) => {
            if (v) onMode?.(v as AnatomyMode)
          }}
          variant="outline"
          size="sm"
          aria-label={t("clinic.anatomy.mode")}
        >
          <ToggleGroupItem value="arterial">{t("clinic.anatomy.arterial")}</ToggleGroupItem>
          <ToggleGroupItem value="venous">{t("clinic.anatomy.venous")}</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="hidden md:flex">
        <div className="w-56 shrink-0 border-r border-things-hairline p-3">
          <BodySilhouette
            fill={MODE_FILL[mode]}
            fillOpacity={0.15}
            stroke={MODE_FILL[mode]}
            activeId={selectedId}
            onRegionClick={onSelect}
          />
        </div>
        <div className="min-w-0 flex-1 p-3">
          <div
            data-slot="anatomy-zoom"
            className="relative mx-auto size-40 overflow-hidden rounded-md border border-things-hairline bg-things-sidebar/40"
          >
            <div
              className="absolute left-0 top-0"
              style={{
                width: 200 * ZOOM,
                height: 240 * ZOOM,
                transform: selected
                  ? `translate(${BOX / 2 - selected.cx * ZOOM}px, ${BOX / 2 - selected.cy * ZOOM}px)`
                  : `translate(${BOX / 2 - 100 * ZOOM}px, ${BOX / 2 - 120 * ZOOM}px)`,
              }}
            >
              <BodySilhouette
                fill={MODE_FILL[mode]}
                fillOpacity={0.15}
                stroke={MODE_FILL[mode]}
                activeId={selectedId}
              />
            </div>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-1">
            {regions.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  data-anatomy-region={r.id}
                  aria-pressed={r.id === selectedId}
                  onClick={() => onSelect?.(r.id)}
                  className={cn(
                    "w-full truncate rounded-sm px-2 py-1 text-left text-xs transition-colors",
                    r.id === selectedId
                      ? "bg-things-select font-medium text-things-blue"
                      : "text-things-title hover:bg-things-hover",
                  )}
                >
                  {r.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-2 p-3 md:hidden">
        <p className="text-xs text-things-gray-3">{t("clinic.anatomy.desktopOnly")}</p>
        {selected && <p data-selected={selected.id} className="text-sm text-things-title">{selected.label}</p>}
      </div>
    </div>
  )
}
