import { useEffect, useState } from "react"
import { Menu, PanelRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"

// AppShell — the four-pane clinic frame (04, Layer 1). ≥lg: rail + resizable
// context + workspace + resizable inspector, sizes persisted to localStorage.
// md: inspector collapses to a right-edge tab opening a Drawer. <md: single
// pane — rail becomes a left Sheet, context a section above the workspace,
// inspector a Drawer. The header (patient banner + allergy banner) and footer
// stay pinned at every size: they are the things that must never be a swipe
// away. The context pane is NOT remounted on breakpoint swap.

const LS_KEY = "clinic-appshell-layout-v2"

export function AppShell({
  rail,
  context,
  children,
  inspector,
  header,
  footer,
  density = "compact",
  contextTitle,
  inspectorTitle,
  className,
}: {
  rail: React.ReactNode
  context?: React.ReactNode
  children: React.ReactNode
  inspector?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  density?: "comfortable" | "compact" | "dense"
  /** Drawer/Sheet titles for the collapsed panes. */
  contextTitle?: string
  inspectorTitle?: string
  className?: string
}) {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [railOpen, setRailOpen] = useState(false)
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [layout, setLayout] = useState<Record<string, number> | null>(null)
  // inspector lives inline only >=lg; below that it is the edge-tab Drawer.
  // A CSS-hidden ResizablePanel would corrupt the group's resize math.
  const [isWide, setIsWide] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const apply = () => setIsWide(mq.matches)
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  useEffect(() => {
    if (isMobile) return
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) setLayout(JSON.parse(raw))
    } catch {
      // corrupted layout — fall back to defaults
    }
  }, [isMobile])

  const persist = (l: Record<string, number>) => {
    setLayout(l)
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(l))
    } catch {
      // storage unavailable — session-only persistence
    }
  }

  const ctxTitle = contextTitle ?? t("clinic.shell.context")
  const insTitle = inspectorTitle ?? t("clinic.shell.inspector")

  return (
    <div data-slot="app-shell" data-density={density} className={cn("flex h-full min-h-0 w-full flex-col bg-background font-sans", className)}>
      {header}

      <div className="flex min-h-0 flex-1">
        {/* rail: fixed at ≥md, Sheet below */}
        {!isMobile && <div className="shrink-0 overflow-y-auto">{rail}</div>}

        {isMobile ? (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-1 border-b border-things-hairline px-2 py-1">
              <Button variant="ghost" size="icon-xs" aria-label={t("clinic.shell.openRail")} onClick={() => setRailOpen(true)}>
                <Menu aria-hidden="true" />
              </Button>
              {context && (
                <Button variant="ghost" size="xs" className="text-xs" onClick={() => setInspectorOpen(false) /* context stays inline on phones */}>
                  {ctxTitle}
                </Button>
              )}
              {inspector && (
                <Button variant="ghost" size="icon-xs" className="ml-auto" aria-label={insTitle} onClick={() => setInspectorOpen(true)}>
                  <PanelRight aria-hidden="true" />
                </Button>
              )}
            </div>
            <main className="min-h-0 flex-1 overflow-y-auto">
              {context && (
                <section aria-label={ctxTitle} className="border-b border-things-hairline p-2">
                  {context}
                </section>
              )}
              <div className="p-3">{children}</div>
            </main>
          </div>
        ) : (
          <ResizablePanelGroup
            orientation="horizontal"
            className="min-h-0 flex-1"
            // persist once when the drag COMPLETES — onLayoutChange fires per
            // pointer-move and would re-render the shell mid-drag
            onLayoutChanged={(l: Record<string, number>) => persist(l)}
          >
            {context && (
              <>
                {/* react-resizable-panels v3: numbers are PIXELS — percentages
                    must be strings. 22 as a number meant a 22px pane. */}
                <ResizablePanel
                  id="ctx"
                  defaultSize={layout?.ctx !== undefined ? `${layout.ctx}%` : "22%"}
                  minSize="14%"
                  maxSize="38%"
                  className="overflow-y-auto p-2"
                >
                  <section aria-label={ctxTitle}>{context}</section>
                </ResizablePanel>
                <ResizableHandle withHandle className="w-1.5 cursor-col-resize transition-colors hover:bg-things-blue/20 [&>*]:cursor-col-resize" />
              </>
            )}
            <ResizablePanel
              id="ws"
              defaultSize={layout?.ws !== undefined ? `${layout.ws}%` : inspector && isWide ? "52%" : "100%"}
              minSize="30%"
              className="overflow-y-auto"
            >
              <main className="p-3">{children}</main>
            </ResizablePanel>
            {inspector && isWide && (
              <>
                <ResizableHandle withHandle className="w-1.5 cursor-col-resize transition-colors hover:bg-things-blue/20 [&>*]:cursor-col-resize" />
                <ResizablePanel
                  id="ins"
                  defaultSize={layout?.ins !== undefined ? `${layout.ins}%` : "24%"}
                  minSize="14%"
                  maxSize="38%"
                  className="overflow-y-auto p-2"
                >
                  <section aria-label={insTitle}>{inspector}</section>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        )}
      </div>

      {footer}

      {/* below md: rail as a left Sheet */}
      <Sheet open={isMobile && railOpen} onOpenChange={setRailOpen}>
        <SheetContent side="left" className="w-56 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>{t("clinic.rail.label")}</SheetTitle>
            <SheetDescription>{t("clinic.shell.openRail")}</SheetDescription>
          </SheetHeader>
          <div className="h-full [&_nav]:h-full [&_nav]:border-r-0">{rail}</div>
        </SheetContent>
      </Sheet>

      {/* inspector Drawer (md tab + mobile button) */}
      <Drawer open={inspectorOpen} onOpenChange={setInspectorOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-left">{insTitle}</DrawerTitle>
            <DrawerDescription className="sr-only">{insTitle}</DrawerDescription>
          </DrawerHeader>
          <div className="max-h-[65vh] overflow-y-auto px-4 pb-4">{inspector}</div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
