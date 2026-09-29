import { useState } from "react"
import { ChevronRight, Star, TriangleAlert } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

// DrugSearchTree — hierarchical drug picker (04, Layer 6; ePrescribing
// Lipitor → oral → tablet → 10/20/40/80 mg). Only leaves are selectable and
// carry the fully-qualified sig. Warning glyphs propagate up. Filter
// checkboxes control which levels render at all — that is what makes the tree
// navigable. `flat` is the below-md skin: leaves only, grouped per drug.

export interface DrugNodeDef {
  id: string
  label: string
  level: 0 | 1 | 2 | 3
  children?: DrugNodeDef[]
  warning?: boolean
  sig?: string
}

export interface DrugTreeFilters {
  route: boolean
  dosage: boolean
  strength: boolean
  autoExpand: boolean
}

/** Depth-1 warning: any leaf under the node warns. */
function nodeWarns(n: DrugNodeDef): boolean {
  if (n.warning) return true
  return (n.children ?? []).some(nodeWarns)
}

export function DrugSearchTree({
  nodes,
  onSelect,
  filters,
  onFiltersChange,
  favorites,
  onToggleFavorite,
  variant = "tree",
  maxHeight = 280,
  className,
}: {
  nodes: DrugNodeDef[]
  onSelect(leaf: DrugNodeDef): void
  filters: DrugTreeFilters
  onFiltersChange?(f: DrugTreeFilters): void
  favorites?: string[]
  onToggleFavorite?(id: string): void
  variant?: "tree" | "flat"
  maxHeight?: number | string
  className?: string
}) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const toggle = (id: string) =>
    setExpanded((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const visibleLevel = (lvl: 0 | 1 | 2 | 3) => {
    if (lvl === 0) return true
    if (lvl === 1) return filters.route
    if (lvl === 2) return filters.dosage
    return filters.strength
  }

  const renderNode = (n: DrugNodeDef, depth: number): React.ReactNode => {
    if (!visibleLevel(n.level)) {
      // level filtered out — children collapse into the parent's slot
      return (n.children ?? []).map((c) => renderNode(c, depth))
    }
    const isLeaf = !n.children || n.children.length === 0
    const warns = nodeWarns(n)

    if (isLeaf) {
      const fav = favorites?.includes(n.id)
      return (
        <div key={n.id} className="group/leaf flex min-h-7 items-center gap-1" style={{ paddingLeft: `calc(${depth}rem + 0.5rem)` }}>
          <button
            type="button"
            onClick={() => onSelect(n)}
            className="flex min-w-0 flex-1 items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-left text-sm text-things-title hover:bg-things-hover"
          >
            {warns && <TriangleAlert className="size-3.5 shrink-0 text-clinic-warn" aria-label={t("clinic.drugtree.warning")} />}
            <span className="truncate">{n.label}</span>
            {n.sig && <span className="truncate font-mono text-[11px] text-things-gray-3">{n.sig}</span>}
          </button>
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={t("clinic.drugtree.favorite")}
              className={cn("size-6 shrink-0 opacity-0 group-hover/leaf:opacity-100 focus-visible:opacity-100", fav && "opacity-100")}
              onClick={() => onToggleFavorite(n.id)}
            >
              <Star className={cn("size-3.5", fav ? "fill-things-gold text-things-gold" : "text-things-gray-3")} aria-hidden="true" />
            </Button>
          )}
        </div>
      )
    }

    const open = filters.autoExpand || expanded.has(n.id)
    return (
      <div key={n.id}>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => toggle(n.id)}
          className="flex min-h-7 w-full items-center gap-1 rounded-sm px-1.5 py-0.5 text-left hover:bg-things-hover"
          style={{ paddingLeft: `calc(${depth}rem + 0.5rem)` }}
        >
          <ChevronRight className={cn("size-3.5 shrink-0 text-things-gray-3 transition-transform", open && "rotate-90")} aria-hidden="true" />
          <span className={cn("truncate", depth === 0 ? "text-sm font-medium text-things-title" : "text-sm text-things-gray-2")}>{n.label}</span>
          {warns && <TriangleAlert className="ml-auto size-3.5 shrink-0 text-clinic-warn" aria-label={t("clinic.drugtree.warning")} />}
        </button>
        {open && <div>{(n.children ?? []).map((c) => renderNode(c, depth + 1))}</div>}
      </div>
    )
  }

  const leavesOf = (n: DrugNodeDef): DrugNodeDef[] => (n.children?.length ? n.children.flatMap(leavesOf) : [n])

  return (
    <div data-slot="drug-tree" data-variant={variant} className={cn("flex flex-col gap-2", className)}>
      {onFiltersChange && variant === "tree" && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-sm bg-things-chip px-2 py-1">
          {(["route", "dosage", "strength", "autoExpand"] as const).map((k) => (
            <label key={k} className="flex min-h-6 cursor-pointer select-none items-center gap-1.5 text-xs text-things-gray-2">
              <Checkbox checked={filters[k]} onCheckedChange={(v) => onFiltersChange({ ...filters, [k]: Boolean(v) })} aria-label={t(`clinic.drugtree.filter.${k}`)} />
              {t(`clinic.drugtree.filter.${k}`)}
            </label>
          ))}
        </div>
      )}

      <div className="overflow-auto rounded-md border border-things-hairline bg-card py-1" style={{ maxHeight }}>
        {variant === "tree" ? (
          nodes.map((n) => renderNode(n, 0))
        ) : (
          // below md: leaves only, grouped per drug — a tree at 390px is a scroll trap
          nodes.map((n) => (
            <section key={n.id}>
              <h4 className="sticky top-0 bg-clinic-grid-header px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-things-gray-2">{n.label}</h4>
              {leavesOf(n).map((leaf) => (
                <button
                  key={leaf.id}
                  type="button"
                  onClick={() => onSelect(leaf)}
                  className="flex min-h-8 w-full items-center gap-1.5 px-2.5 text-left text-sm hover:bg-things-hover"
                >
                  {leaf.warning && <TriangleAlert className="size-3.5 shrink-0 text-clinic-warn" aria-hidden="true" />}
                  <span className="truncate text-things-title">{leaf.label}</span>
                  {leaf.sig && <span className="truncate font-mono text-[11px] text-things-gray-3">{leaf.sig}</span>}
                </button>
              ))}
            </section>
          ))
        )}
      </div>
    </div>
  )
}
