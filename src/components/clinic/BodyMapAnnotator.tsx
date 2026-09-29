import { useState } from "react"
import { Maximize2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BODY_REGIONS, BodySilhouette, RegionMarker } from "./BodyMap"

// BodyMapAnnotator — foot-exam / cardiology body annotation (04, Layer 9):
// named regions on a schematic SVG, ⊕/⊖ markers by click. Desktop-only as a
// canvas; below md the findings list + "view diagram" dialog carry it.

export interface BodyMarker {
  id: string
  regionId: string
  note?: string
  tone?: "warn" | "critical" | "ok"
}

const regionName = (id: string) => BODY_REGIONS.find((r) => r.id === id)?.label ?? id

export function BodyMapAnnotator({
  markers,
  onToggleMarker,
  className,
}: {
  markers: BodyMarker[]
  /** Click a region: add a marker, click again to remove. */
  onToggleMarker?: (regionId: string) => void
  className?: string
}) {
  const { t } = useTranslation()
  const [dialogOpen, setDialogOpen] = useState(false)

  const canvas = (
    <BodySilhouette
      markedIds={markers.map((m) => m.regionId)}
      onRegionClick={onToggleMarker}
      renderOverlays={(region) => {
        const marker = markers.find((m) => m.regionId === region.id)
        return marker ? <RegionMarker cx={region.cx} cy={region.cy} tone={marker.tone} /> : null
      }}
    />
  )

  return (
    <div
      data-slot="body-map-annotator"
      className={cn("overflow-hidden rounded-md border border-things-hairline bg-card", className)}
    >
      <div className="hidden p-4 md:block">{canvas}</div>
      {/* <md: findings list + view-diagram action */}
      <div className="space-y-3 p-3 md:hidden">
        <ul className="divide-y divide-things-hairline/60 rounded-md border border-things-hairline">
          {markers.length === 0 && (
            <li className="px-3 py-4 text-center text-sm text-things-gray-3">{t("clinic.bodymap.empty")}</li>
          )}
          {markers.map((m) => (
            <li key={m.id} data-marker={m.regionId} className="px-3 py-2 text-sm">
              <span className="font-medium text-things-title">{regionName(m.regionId)}</span>
              {m.note && <span className="ml-2 text-xs text-things-gray-2">{m.note}</span>}
            </li>
          ))}
        </ul>
        <Button variant="outline" size="sm" className="w-full" onClick={() => setDialogOpen(true)}>
          <Maximize2 className="size-3.5" aria-hidden="true" />
          {t("clinic.bodymap.view")}
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>{t("clinic.bodymap.dialogTitle")}</DialogTitle>
              <DialogDescription>{t("clinic.bodymap.dialogDesc")}</DialogDescription>
            </DialogHeader>
            <div className="mx-auto max-w-[220px]">{canvas}</div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
