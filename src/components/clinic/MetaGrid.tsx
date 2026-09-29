import { cn } from "@/lib/utils"

/** Label → value pairs in columns (04, Layer 6) — the single most repeated
 * structure in the screenshot set. Columns collapse 4→2→1. */
export function MetaGrid({
  items,
  columns = 3,
  className,
}: {
  items: { label: React.ReactNode; value: React.ReactNode; span?: 1 | 2 | 3 | 4; numeric?: boolean }[]
  columns?: 1 | 2 | 3 | 4
  className?: string
}) {
  const gridCls =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : columns === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-2 md:grid-cols-4"
  // A span wider than the grid's current column count would mint implicit
  // columns sized by content (page-level overflow at phone width), so spans
  // only engage at the breakpoint where their columns exist.
  const spanCls = (span?: 1 | 2 | 3 | 4) => {
    if (!span || span === 1 || columns === 1) return undefined
    if (columns === 2) return "sm:col-span-2"
    if (columns === 3) return span === 2 ? "sm:col-span-2" : "lg:col-span-3"
    return span === 2 ? "col-span-2" : span === 3 ? "md:col-span-3" : "md:col-span-4"
  }
  return (
    <dl className={cn("grid gap-x-4 gap-y-2", gridCls, className)}>
      {items.map((item, i) => (
        <div key={i} className={cn("flex min-w-0 flex-col", spanCls(item.span))}>
          <dt className="text-xs text-things-gray-3">{item.label}</dt>
          <dd className={cn("truncate text-sm text-things-ink", item.numeric && "clinic-num")} title={typeof item.value === "string" ? item.value : undefined}>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
