export type Route =
  | { kind: "inbox" }
  | { kind: "today" }
  | { kind: "upcoming" }
  | { kind: "anytime" }
  | { kind: "someday" }
  | { kind: "logbook" }
  | { kind: "trash" }
  | { kind: "project"; id: number }
  | { kind: "area"; id: number }

export function parsePath(pathname: string): Route {
  const parts = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean)
  const [head, id] = parts
  const numId = id ? Number(id) : NaN
  switch (head) {
    case undefined:
    case "today":
      return { kind: "today" }
    case "inbox":
      return { kind: "inbox" }
    case "upcoming":
      return { kind: "upcoming" }
    case "anytime":
      return { kind: "anytime" }
    case "someday":
      return { kind: "someday" }
    case "logbook":
      return { kind: "logbook" }
    case "trash":
      return { kind: "trash" }
    case "projects":
      return Number.isFinite(numId) ? { kind: "project", id: numId } : { kind: "anytime" }
    case "areas":
      return Number.isFinite(numId) ? { kind: "area", id: numId } : { kind: "today" }
    default:
      return { kind: "today" }
  }
}

export function routeToPath(route: Route): string {
  switch (route.kind) {
    case "today":
      return "/today"
    case "project":
      return `/projects/${route.id}`
    case "area":
      return `/areas/${route.id}`
    default:
      return `/${route.kind}`
  }
}

export function taskPathFor(task: { project_id: number | null; area_id: number | null }): string {
  if (task.project_id) return `/projects/${task.project_id}`
  if (task.area_id) return `/areas/${task.area_id}`
  return "/inbox"
}
