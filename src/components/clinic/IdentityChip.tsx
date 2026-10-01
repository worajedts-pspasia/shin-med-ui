import { ChevronDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export type ChipTone = "gold" | "blue" | "gray"
export type IdentityChipVariant = "static" | "menu" | "add"

const TONE: Record<ChipTone, string> = {
  gold: "bg-things-gold text-things-ink-strong",
  blue: "bg-things-blue-soft text-things-blue",
  gray: "bg-things-select text-things-gray-2",
}

function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  )
}

/** Who a thing belongs to — owner, follower, assignee, care-team member:
 *  avatar, name, role, at most one caret menu. The existing chips say what
 *  an item *has*; this one says who it *belongs to*, and it stays on screen
 *  after Recipient Picker has done its picking. */
export function IdentityChip({
  name,
  role,
  initials,
  tone = "blue",
  variant = "static",
  dense = false,
  onClick,
  title,
  className,
}: {
  name: string
  role?: string
  initials?: string
  tone?: ChipTone
  variant?: IdentityChipVariant
  dense?: boolean
  onClick?: () => void
  title?: string
  className?: string
}) {
  const add = variant === "add"
  const Tag = variant === "static" && !onClick ? "span" : "button"
  return (
    <Tag
      type={Tag === "button" ? "button" : undefined}
      onClick={onClick}
      title={title ?? (variant === "menu" ? `Change ${role ?? "person"}` : undefined)}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-things-box bg-card",
        dense ? "h-6.5 gap-1.5 px-2" : "h-8 px-2.5",
        Tag === "button" && "cursor-pointer hover:bg-things-hover",
        add && "border-dashed border-things-box text-things-blue",
        className,
      )}
    >
      {add ? (
        <Plus className="size-3.5" aria-hidden="true" />
      ) : (
        <span
          className={cn(
            "flex items-center justify-center rounded-full font-bold",
            dense ? "size-4 text-[8px]" : "size-5.5 text-[9px]",
            TONE[tone],
          )}
          aria-hidden="true"
        >
          {initials ?? initialsOf(name)}
        </span>
      )}
      <span className="truncate">
        <span className={cn("font-semibold text-things-ink-strong", dense ? "text-xs" : "text-[13px]")}>
          {name}
        </span>
        {role && <span className="ml-1 text-[11px] text-things-gray-2">· {role}</span>}
      </span>
      {variant === "menu" && <ChevronDown className="size-3 shrink-0 text-things-gray-2" aria-hidden="true" />}
    </Tag>
  )
}

/** The quiet residue after picking: overlapping avatars plus a count. */
export function FollowerStack({
  followers,
  label,
  title,
}: {
  followers: { initials: string; tone?: ChipTone }[]
  label?: string
  title?: string
}) {
  return (
    <span className="inline-flex items-center" title={title}>
      {followers.map((f, i) => (
        <span
          key={i}
          className={cn(
            "flex size-5.5 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold",
            i > 0 && "-ml-2",
            TONE[f.tone ?? "gray"],
          )}
          aria-hidden="true"
        >
          {f.initials}
        </span>
      ))}
      {label && <span className="ml-1.5 text-[11px] text-things-gray-2">{label}</span>}
    </span>
  )
}
