import { cloneElement, isValidElement, useState, type ReactElement } from "react"
import { cn } from "@/lib/utils"

// PanelStack — vertical stack of CollapsiblePanels with an accordion mode
// (04, Layer 1). `accordion` keeps only one panel open — what the right rail
// needs when the inspector is short. Open-state control is injected into each
// CollapsiblePanel child.

type PanelChild = ReactElement<{ defaultOpen?: boolean; open?: boolean; onOpenChange?: (v: boolean) => void }>

export function PanelStack({
  children,
  mode = "independent",
  className,
}: {
  children: React.ReactNode
  mode?: "independent" | "accordion"
  className?: string
}) {
  const [openId, setOpenId] = useState<number | null>(null)

  const items: React.ReactNode[] = Array.isArray(children) ? children : [children]

  return (
    <div data-slot="panel-stack" data-mode={mode} className={cn("flex flex-col gap-2", className)}>
      {items.map((child, i) => {
        if (!isValidElement<{ defaultOpen?: boolean; onOpenChange?: (v: boolean) => void; open?: boolean }>(child) || mode !== "accordion") return child
        const panel = child as PanelChild
        return cloneElement(panel, {
          open: openId === null ? (panel.props.defaultOpen ?? true) : openId === i,
          onOpenChange: (v: boolean) => {
            if (v) setOpenId(i)
            else if (openId === i) setOpenId(null)
          },
        })
      })}
    </div>
  )
}
