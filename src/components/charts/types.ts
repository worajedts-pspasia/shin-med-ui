import type { ChartConfig } from "@/components/ui/chart"

/** One chart row. `null` gaps a series (forecast tails, missing days). */
export type ChartDatum = Record<string, string | number | null>

/** One plotted series — `key` matches the data field, `label` feeds the
 *  config (tooltip + legend), `color` defaults to the palette below.
 *  `dash` is only read by LineChart (dashed projection segments). */
export interface ChartSeries {
  key: string
  label: string
  color?: string
  dash?: string
}

/** Default series palette — shin-med-ui token variables, theme-aware.
 *  Referenced as `var(--color-<key>)` once ChartContainer injects them. */
export const PALETTE = [
  "var(--color-things-blue)",
  "var(--color-clinic-ok)",
  "var(--color-things-gold-dark)",
  "var(--color-things-purple)",
  "var(--color-things-teal)",
  "var(--color-clinic-warn)",
  "var(--color-things-evening)",
  "var(--color-clinic-critical)",
] as const

/** Builds the ChartConfig every chart in this group shares. */
export function buildConfig(series: ChartSeries[]): ChartConfig {
  const config: ChartConfig = {}
  series.forEach((s, i) => {
    config[s.key] = { label: s.label, color: s.color ?? PALETTE[i % PALETTE.length] }
  })
  return config
}
