import { useState } from "react"
import { Crop, Download, FileText, Printer, RefreshCcw, Send, ZoomIn, ZoomOut } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { ActionToolbar, type ToolbarAction } from "./ActionToolbar"

// DocumentViewer — image / PDF pane (04, Layer 7; eDocuments, fax viewers,
// HIE). Header (breadcrumb + compact patient slot), action toolbar with
// disabled verbs visibly grayed ("Resend Fax" on a received document), canvas,
// status footer (filename · size · ID · zoom %). `floating` renders the
// external-content chrome — WinForms EMR's orange-titled window becomes a ringed
// overlay with a title bar. Below md: full-screen Sheet; edit tools (crop,
// rotate) hide — they are desk work.

export function DocumentViewer({
  src,
  kind,
  meta,
  breadcrumb,
  patientSlot,
  floating = false,
  disabledActions = [],
  className,
}: {
  src: string
  kind: "image" | "pdf" | "markup"
  meta: { filename: string; size?: string; id?: string }
  breadcrumb?: React.ReactNode
  patientSlot?: React.ReactNode
  floating?: boolean
  /** Toolbar verbs rendered grayed-out, e.g. ["resend-fax"]. */
  disabledActions?: string[]
  className?: string
}) {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [zoom, setZoom] = useState(100)

  const canvas = (
    <div className="flex min-h-0 flex-1 items-start justify-center overflow-auto bg-things-sidebar/60 p-3">
      {kind === "image" && (
        <img
          src={src}
          alt={meta.filename}
          className="max-w-full shadow-md"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
        />
      )}
      {kind === "pdf" && (
        <iframe src={src} title={meta.filename} className="h-[480px] w-full max-w-3xl border border-things-hairline bg-card shadow-md" />
      )}
      {kind === "markup" && (
        <pre className="max-w-3xl whitespace-pre-wrap rounded border border-things-hairline bg-card p-3 font-mono text-xs text-things-ink" style={{ zoom: zoom / 100 }}>
          {src}
        </pre>
      )}
    </div>
  )

  const actions: ToolbarAction[] = [
    { id: "zoom-in", icon: ZoomIn, label: t("clinic.doc.zoomIn"), onSelect: () => setZoom((z: number) => Math.min(200, z + 25)) },
    { id: "zoom-out", icon: ZoomOut, label: t("clinic.doc.zoomOut"), onSelect: () => setZoom((z: number) => Math.max(50, z - 25)) },
    { id: "rotate", icon: RefreshCcw, label: t("clinic.doc.rotate") },
    { id: "crop", icon: Crop, label: t("clinic.doc.crop") },
    { id: "print", icon: Printer, label: t("clinic.doc.print") },
    { id: "download", icon: Download, label: t("clinic.doc.download") },
    { id: "resend-fax", icon: Send, label: t("clinic.doc.resendFax") },
  ].map((a) => (disabledActions.includes(a.id) ? { ...a, disabled: true } : a))
  // edit tools are desk work — hidden on phones
  const visibleActions = isMobile ? actions.filter((a) => !["rotate", "crop"].includes(a.id)) : actions

  const body = (
    <div
      data-slot="document-viewer"
      data-kind={kind}
      data-floating={floating ? "" : undefined}
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden bg-card",
        floating ? "rounded-md shadow-lg ring-1 ring-things-border" : "rounded-md border border-things-hairline",
        className,
      )}
    >
      {floating && (
        <div className="flex items-center gap-2 border-b border-things-hairline bg-clinic-warn-soft px-2.5 py-1.5 text-xs font-semibold text-clinic-warn">
          <FileText className="size-3.5" aria-hidden="true" />
          {t("clinic.doc.externalContent")}
        </div>
      )}
      <header className="flex min-h-9 flex-wrap items-center gap-2 border-b border-things-hairline px-2.5 py-1.5">
        {breadcrumb && <nav className="min-w-0 flex-1 truncate text-xs text-things-gray-2">{breadcrumb}</nav>}
        {patientSlot}
      </header>
      <ActionToolbar label={t("clinic.doc.actions")} actions={visibleActions} className="border-b border-things-hairline px-1 py-0.5" />
      {canvas}
      <footer className="flex flex-wrap items-center gap-x-3 gap-y-0.5 border-t border-things-hairline px-2.5 py-1 text-[11px] text-things-gray-3">
        <span className="truncate">{meta.filename}</span>
        {meta.size && <span className="clinic-num">{meta.size}</span>}
        {meta.id && <span className="clinic-num">{t("clinic.doc.id")} {meta.id}</span>}
        <span className="clinic-num ml-auto">{zoom}%</span>
      </footer>
    </div>
  )

  if (isMobile) {
    // below md the viewer is full-bleed (parents may mount it in a Sheet);
    // edit tools already hidden above
    return <div className="h-[96vh] w-full">{body}</div>
  }

  return body
}
