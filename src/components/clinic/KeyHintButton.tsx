import { useEffect } from "react"
import type { LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"

// KeyHintButton — button with a keyboard-shortcut affordance (04, Layer 1;
// Thai VB6 product บันทึกประวัติ/F2, tabs [F5]–[F9]). Registers the shortcut
// globally. Desktop-era clinic staff are keyboard-driven — a real feature,
// not decoration. The hint hides below md; `showHint="never"` hides it
// everywhere (the shortcut still registers).

function matchesShortcut(e: KeyboardEvent, shortcut: string): boolean {
  const parts = shortcut.split("+").map((p) => p.trim())
  const key = parts[parts.length - 1].toLowerCase()
  const want = (re: RegExp) => parts.slice(0, -1).some((p) => re.test(p))
  if (want(/^ctrl$/i) !== e.ctrlKey) return false
  if (want(/^(cmd|meta|⌘)$/i) !== e.metaKey) return false
  if (want(/^alt$/i) !== e.altKey) return false
  // shift is only enforced when explicitly part of the combo
  if (want(/^shift$/i) && !e.shiftKey) return false
  return e.key.toLowerCase() === key
}

function isTypingTarget(e: KeyboardEvent): boolean {
  const el = e.target
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement ||
    (el instanceof HTMLElement && el.isContentEditable)
  )
}

export function KeyHintButton({
  label,
  shortcut,
  icon: Icon,
  variant = "outline",
  size = "sm",
  onSelect,
  showHint = "always",
  disabled = false,
  className,
  ...props
}: {
  label: string
  /** e.g. "F2", "Ctrl+S", "⌘K" */
  shortcut: string
  icon?: LucideIcon
  variant?: React.ComponentProps<typeof Button>["variant"]
  size?: React.ComponentProps<typeof Button>["size"]
  onSelect?: () => void
  showHint?: "always" | "hover" | "never"
  disabled?: boolean
} & Omit<React.ComponentProps<typeof Button>, "label" | "onSelect" | "variant" | "size">) {
  const { t } = useTranslation()

  useEffect(() => {
    if (disabled || !onSelect) return
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e)) return
      if (matchesShortcut(e, shortcut)) {
        e.preventDefault()
        onSelect()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [shortcut, onSelect, disabled])

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onSelect}
      aria-keyshortcuts={shortcut}
      className={cn("group/khb", className)}
      {...props}
    >
      {Icon && <Icon aria-hidden="true" />}
      {label}
      <Kbd
        aria-hidden="true"
        className={cn(
          "pointer-events-none ml-0.5 hidden md:inline-flex",
          showHint === "never" && "md:hidden",
          showHint === "hover" && "opacity-0 transition-opacity group-hover/khb:opacity-100 focus-visible:opacity-100",
        )}
      >
        {shortcut}
      </Kbd>
      <span className="sr-only">{t("clinic.keyhint.shortcutIs", { shortcut })}</span>
    </Button>
  )
}
