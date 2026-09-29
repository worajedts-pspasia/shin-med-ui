import { Moon } from "lucide-react"
import { ProgressPie } from "@/components/things/icons"
import { HeaderMenu } from "@/components/things/TaskRow"
import type { ApiProject } from "@/api/types"

export function ViewHeader({
  icon,
  title,
  subtitle,
  right,
}: {
  icon?: React.ReactNode
  title: string
  subtitle?: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <div className="flex items-end justify-between gap-3 px-3 pt-7 pb-3">
      <div className="flex min-w-0 items-center gap-2.5">
        {icon && <span className="mb-0.5 flex size-6 items-center justify-center">{icon}</span>}
        <div>
          <h1 className="text-[27px] font-bold leading-none tracking-[-0.022em] text-things-title">{title}</h1>
          {subtitle && <p className="mt-1.5 text-[13.5px] leading-none text-things-gray">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  )
}

export function Sep({ label, moon }: { label: string; moon?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 px-3 pb-1.5 pt-6">
      {moon && <Moon className="size-[13px] text-things-evening" strokeWidth={1.9} />}
      <span className="whitespace-nowrap text-[12.5px] font-semibold text-things-blue">{label}</span>
      <span className="h-px flex-1 bg-things-hairline" />
    </div>
  )
}

export function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 px-3 pb-1.5 pt-6">
      <span className="whitespace-nowrap text-[13px] font-semibold text-things-gray-5">{children}</span>
      <span className="h-px flex-1 bg-things-hairline" />
    </div>
  )
}

export function ProjectHeader({
  project,
  remaining,
  onOpen,
}: {
  project: ApiProject
  remaining: number
  onOpen: () => void
}) {
  const total = Math.max(1, project.total_count)
  const done = total - remaining
  return (
    <div className="group flex items-center gap-2.5 px-3 pt-6">
      <ProgressPie fraction={done / total} size={20} />
      <button
        type="button"
        onClick={onOpen}
        className="truncate text-[16.5px] font-semibold tracking-[-0.01em] text-things-title hover:text-things-blue"
      >
        {project.name}
      </button>
      <span className="h-px flex-1 bg-things-hairline" />
      {remaining > 0 && <span className="text-[12px] tabular-nums text-things-gray">{remaining}</span>}
      <HeaderMenu className="opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  )
}
