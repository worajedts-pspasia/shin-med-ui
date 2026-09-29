import { createContext, useContext } from "react"
import { cn } from "@/lib/utils"

// FormGrid — the base form layout kit (04, Layer 7). Labels sit ABOVE fields
// (Thai labels are long — above beats side); help text is gray-3 at xs; the
// read-only "filled field" from the sources is the soft blue fill. Complements
// MetaGrid: MetaGrid displays, FormGrid edits.

// Static class maps — Tailwind's JIT cannot see template-built classes.
const GRID: Record<1 | 2 | 3, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
}

// A fixed row keeps its columns at every breakpoint — the address cascade
// (เลขที่ / หมู่ / ถนน) stays 3-col on a phone, matching the source behavior.
const FIXED_GRID: Record<1 | 2 | 3, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
}

const FormGridContext = createContext<1 | 2 | 3>(2)

/** Apply to inputs alongside their own classes: the read-only "filled field". */
export const readOnlyFieldClass = "read-only:bg-things-blue-soft/50"

export function FormGrid({
  columns = 2,
  className,
  ...props
}: React.ComponentProps<"div"> & { columns?: 1 | 2 | 3 }) {
  return (
    <FormGridContext.Provider value={columns}>
      <div data-slot="form-grid" className={cn("grid gap-x-4 gap-y-3", GRID[columns], className)} {...props} />
    </FormGridContext.Provider>
  )
}

/** Hairline-topped group with a 13px title and optional muted description. */
export function FormSection({
  title,
  description,
  columns,
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & { title: React.ReactNode; description?: React.ReactNode; columns?: 1 | 2 | 3 }) {
  return (
    <section
      data-slot="form-section"
      className={cn("border-t border-things-hairline pt-4 first:mt-0 first:border-t-0 first:pt-0", className)}
      {...props}
    >
      <div className="mb-3">
        <h3 className="text-[13px] font-semibold tracking-tight text-things-title">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-things-gray-3">{description}</p>}
      </div>
      <FormGrid columns={columns}>{children}</FormGrid>
    </section>
  )
}

/** One grid row; inherits the parent FormGrid's column count unless given. */
export function FormRow({
  columns,
  fixed,
  className,
  ...props
}: React.ComponentProps<"div"> & { columns?: 1 | 2 | 3; fixed?: boolean }) {
  const inherited = useContext(FormGridContext)
  const n = columns ?? inherited
  return (
    <div
      data-slot="form-row"
      data-fixed={fixed ? "" : undefined}
      className={cn("col-span-full grid gap-x-4 gap-y-3", fixed ? FIXED_GRID[n] : GRID[n], className)}
      {...props}
    />
  )
}

/** Red asterisk; the owning Field/Input carries aria-required. */
export function RequiredMark() {
  return (
    <span aria-hidden="true" className="ml-0.5 select-none text-clinic-critical">
      *
    </span>
  )
}
