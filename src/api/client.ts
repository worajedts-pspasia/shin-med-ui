import type { ApiArea, ApiChecklistItem, ApiProject, ApiTag, ApiTask, AreaShow, Bootstrap, Bucket, ProjectShow, SearchResult } from "./types"

const csrfToken = () =>
  document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ?? ""

async function rawReq(method: string, url: string, token: string, body?: unknown): Promise<Response> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (method !== "GET") headers["X-CSRF-Token"] = token
  return fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) })
}

async function req<T>(method: string, url: string, body?: unknown): Promise<T> {
  let res = await rawReq(method, url, csrfToken(), body)
  // Stale CSRF token (session rotated under a long-lived page): refresh once and retry.
  if (res.status === 422 && method !== "GET") {
    const fresh = await fetch("/api/v1/csrf").then((r) => r.json()).catch(() => null)
    if (fresh?.token) {
      document.querySelector('meta[name="csrf-token"]')?.setAttribute("content", fresh.token)
      res = await rawReq(method, url, fresh.token, body)
    }
  }
  if (res.status === 204) return undefined as T
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`
    try {
      const data = await res.json()
      message = data.error ? `${data.error}${data.details ? ": " + data.details.join(", ") : ""}` : message
    } catch {
      /* keep status message */
    }
    throw new Error(message)
  }
  return res.json()
}

export const api = {
  bootstrap: () => req<Bootstrap>("GET", "/api/v1/bootstrap"),
  tasks: (bucket: Bucket) => req<ApiTask[]>("GET", `/api/v1/tasks?bucket=${bucket}`),
  createTask: (params: { title: string; when_date?: string | null; evening?: boolean; someday?: boolean; deadline_date?: string | null; project_id?: number | null; area_id?: number | null; reminder_at?: string | null; tag_ids?: number[] }) =>
    req<ApiTask>("POST", "/api/v1/tasks", params),
  updateTask: (id: number, params: Record<string, unknown>) => req<ApiTask>("PATCH", `/api/v1/tasks/${id}`, params),
  taskAction: (id: number, action: string, params?: Record<string, unknown>) =>
    req<ApiTask>("POST", `/api/v1/tasks/${id}/${action}`, params ?? {}),
  deleteTask: (id: number) => req<ApiTask>("DELETE", `/api/v1/tasks/${id}`),
  completeAllToday: () => req<void>("POST", "/api/v1/tasks/complete_all", { bucket: "today" }),
  emptyTrash: () => req<void>("DELETE", "/api/v1/trash/empty"),

  addChecklistItem: (taskId: number, title: string) =>
    req<ApiChecklistItem>("POST", `/api/v1/tasks/${taskId}/checklist_items`, { title }),
  updateChecklistItem: (taskId: number, itemId: number, params: { title?: string; completed?: boolean }) =>
    req<ApiChecklistItem>("PATCH", `/api/v1/tasks/${taskId}/checklist_items/${itemId}`, params),
  deleteChecklistItem: (taskId: number, itemId: number) =>
    req<void>("DELETE", `/api/v1/tasks/${taskId}/checklist_items/${itemId}`),

  project: (id: number) => req<ProjectShow>("GET", `/api/v1/projects/${id}`),
  createProject: (params: { name: string; color?: string; area_id?: number | null }) =>
    req<ApiProject>("POST", "/api/v1/projects", params),
  updateProject: (id: number, params: Record<string, unknown>) => req<ApiProject>("PATCH", `/api/v1/projects/${id}`, params),
  deleteProject: (id: number) => req<void>("DELETE", `/api/v1/projects/${id}`),
  createHeading: (projectId: number, name: string) =>
    req<{ id: number; name: string }>("POST", `/api/v1/projects/${projectId}/headings`, { name }),

  area: (id: number) => req<AreaShow>("GET", `/api/v1/areas/${id}`),
  createArea: (params: { name: string }) => req<ApiArea>("POST", "/api/v1/areas", params),
  updateArea: (id: number, params: { name: string }) => req<ApiArea>("PATCH", `/api/v1/areas/${id}`, params),
  deleteArea: (id: number) => req<void>("DELETE", `/api/v1/areas/${id}`),

  updateProfile: (params: { locale: string }) => req<{ email: string; locale: string }>("PATCH", "/api/v1/profile", { user: params }),

  tags: () => req<ApiTag[]>("GET", "/api/v1/tags"),
  createTag: (params: { name: string }) => req<ApiTag>("POST", "/api/v1/tags", params),

  search: (q: string) => req<SearchResult>("GET", `/api/v1/search?q=${encodeURIComponent(q)}`),
}
