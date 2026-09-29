import { ChevronRight, FileText, Folder } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { PaginationFooter } from "./PaginationFooter"
import { PaperSurface } from "./PaperSurface"
import { ResultTable, type ResultPanel } from "./ResultTable"

// ——— ResultReport ——— a full external lab report (04, Layer 5; the Quest
// report). Rendered on clinic-paper because it is a RECEIVED document, not
// app data: identity grid header + ResultTable + page footer + a
// "View HL7 File" disclosure.

export interface ResultReportHeader {
  requisition: string
  accession: string
  collectedAt: string
  reportedAt: string
  patient: { nameLine: string; dob: string; mrn: string }
}

export function ResultReport({
  header,
  panels,
  page = 1,
  pageCount = 1,
  onPage,
  hl7,
  fit = true,
  className,
}: {
  header: ResultReportHeader
  panels: ResultPanel[]
  /** Columns flex to fill the sheet (default) instead of fixed widths. */
  fit?: boolean
  page?: number
  pageCount?: number
  onPage?(p: number): void
  hl7?: string
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <PaperSurface size="a4" serif className={className}>
      <div className="flex flex-col gap-3 p-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 border-b border-clinic-paper-edge pb-3 text-xs sm:grid-cols-4">
          {(
            [
              [t("clinic.report.requisition"), header.requisition],
              [t("clinic.report.accession"), header.accession],
              [t("clinic.report.collected"), header.collectedAt],
              [t("clinic.report.reported"), header.reportedAt],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wide text-clinic-paper-ink/50">{k}</span>
              <span className="clinic-num font-medium">{v}</span>
            </div>
          ))}
          <div className="col-span-2 flex flex-col sm:col-span-4">
            <span className="text-[10px] uppercase tracking-wide text-clinic-paper-ink/50">{t("clinic.report.patient")}</span>
            <span className="font-semibold">
              {header.patient.nameLine} <span className="clinic-num font-normal">· {header.patient.dob} · {header.patient.mrn}</span>
            </span>
          </div>
        </div>

        <ResultTable panels={panels} maxHeight={480} fit={fit} />

        {hl7 && (
          <details className="text-xs">
            <summary className="cursor-pointer text-things-blue underline decoration-things-blue/40">{t("clinic.report.viewHl7")}</summary>
            <pre className="mt-2 max-h-40 overflow-auto rounded border border-clinic-paper-edge bg-card/60 p-2 font-mono text-[10px] leading-relaxed">{hl7}</pre>
          </details>
        )}
      </div>
      <PaginationFooter total={pageCount} page={page} pageCount={pageCount} onPage={onPage ?? (() => {})} unit="rows" className="border-t border-clinic-paper-edge bg-transparent px-4" />
    </PaperSurface>
  )
}

// ——— SummaryOfCareTable ——— striped label/value clinical summary (04,
// Layer 7; the CCD). Label column on a tinted band (things-blue-soft when
// emphasized); long values wrap; span={2} widens a row. Absorbs the parent
// packages' generic DocMetadataBlock.

export interface SocSection {
  label: string
  rows: Array<{ label: string; value: React.ReactNode; span?: 1 | 2 }>
}

export function SummaryOfCareTable({
  sections,
  emphasis = false,
  header,
  className,
}: {
  sections: SocSection[]
  emphasis?: boolean
  header?: React.ReactNode
  className?: string
}) {
  return (
    <PaperSurface size="a4" className={className}>
      {header && <div className="border-b border-clinic-paper-edge p-4">{header}</div>}
      <div className="flex flex-col">
        {sections.map((sec) => (
          <section key={sec.label} className="grid grid-cols-[7rem_1fr] border-b border-clinic-paper-edge last:border-b-0">
            <h4 className={cn("border-r border-clinic-paper-edge px-2 py-2 text-[11px] font-semibold uppercase tracking-wide", emphasis ? "bg-things-blue-soft" : "bg-clinic-lane")}>
              {sec.label}
            </h4>
            <dl className="flex flex-col">
              {sec.rows.map((r, i) =>
                r.span === 2 ? (
                  <div key={r.label} className={cn("border-b border-clinic-paper-edge/60 px-2 py-1 last:border-b-0", i % 2 === 1 && "bg-clinic-zebra")}>
                    <span className="mr-2 text-xs text-clinic-paper-ink/60">{r.label}:</span>
                    <span className="text-[13px]">{r.value}</span>
                  </div>
                ) : (
                  <div key={r.label} className={cn("grid grid-cols-[7rem_1fr] border-b border-clinic-paper-edge/60 last:border-b-0", i % 2 === 1 && "bg-clinic-zebra")}>
                    <dt className="px-2 py-1 text-xs text-clinic-paper-ink/60">{r.label}</dt>
                    <dd className="px-2 py-1 text-[13px]">{r.value}</dd>
                  </div>
                ),
              )}
            </dl>
          </section>
        ))}
      </div>
    </PaperSurface>
  )
}

// ——— DocumentTree ——— folder tree with counts (04, Layer 7). Zero-count
// folders stay visible and muted (DICOM (0)) — absence is information.

export interface DocTreeNode {
  id: string
  label: string
  count?: number
  icon?: LucideIcon
  children?: DocTreeNode[]
}

export function DocumentTree({
  nodes,
  selected,
  onSelect,
  className,
}: {
  nodes: DocTreeNode[]
  selected?: string
  onSelect?(id: string): void
  className?: string
}) {
  return (
    <ul data-slot="document-tree" role="tree" className={cn("flex flex-col", className)}>
      {nodes.map((n) => (
        <TreeNode key={n.id} node={n} depth={0} selected={selected} onSelect={onSelect} />
      ))}
    </ul>
  )
}

function TreeNode({
  node,
  depth,
  selected,
  onSelect,
}: {
  node: DocTreeNode
  depth: number
  selected?: string
  onSelect?(id: string): void
}) {
  const [open, setOpen] = useState(depth === 0)
  const hasKids = Boolean(node.children?.length)
  const Icon = node.icon ?? (hasKids ? Folder : FileText)
  const isEmpty = node.count === 0
  const isSel = node.id === selected

  return (
    <li role="treeitem" aria-expanded={hasKids ? open : undefined}>
      <button
        type="button"
        onClick={() => (hasKids ? setOpen((o) => !o) : onSelect?.(node.id))}
        className={cn(
          "flex min-h-7 w-full items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-left text-sm",
          isSel ? "bg-things-select text-things-blue" : "hover:bg-things-hover",
          isEmpty && !isSel && "text-things-gray-3",
        )}
        style={{ paddingLeft: `${depth + 0.375}rem` }}
      >
        {hasKids ? (
          <ChevronRight className={cn("size-3.5 shrink-0 text-things-gray-3 transition-transform", open && "rotate-90")} aria-hidden="true" />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        <Icon className="size-3.5 shrink-0 text-things-gray-3" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">{node.label}</span>
        {node.count !== undefined && <span className="clinic-num shrink-0 text-[11px] text-things-gray-3">({node.count})</span>}
      </button>
      {hasKids && open && (
        <ul role="group">
          {node.children!.map((c) => (
            <TreeNode key={c.id} node={c} depth={depth + 1} selected={selected} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </li>
  )
}
