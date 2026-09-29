export type ApiTag = { id: number; name: string }

export type ApiChecklistItem = { id: number; title: string; completed: boolean }

export type ApiTask = {
  id: number
  title: string
  notes: string | null
  when_date: string | null
  reminder_at: string | null
  evening: boolean
  deadline_date: string | null
  status: "open" | "completed" | "canceled"
  someday: boolean
  trashed: boolean
  completed_at: string | null
  position: number
  project_id: number | null
  area_id: number | null
  heading_id: number | null
  tags: ApiTag[]
  checklist_items: ApiChecklistItem[]
}

export type ApiProject = {
  id: number
  name: string
  color: string
  notes: string | null
  archived: boolean
  area_id: number | null
  open_count: number
  total_count: number
}

export type ApiArea = { id: number; name: string; open_count?: number }

export type Bootstrap = {
  user: { email: string; locale: "en" | "th" | "ja"; api_token: string }
  areas: ApiArea[]
  projects: ApiProject[]
  tags: ApiTag[]
  counts: Record<string, number>
}

export type Bucket = "today" | "inbox" | "upcoming" | "anytime" | "someday" | "logbook" | "trash"

export type ProjectShow = ApiProject & {
  headings: { id: number; name: string }[]
  tasks: ApiTask[]
}

export type AreaShow = ApiArea & { tasks: ApiTask[] }

export type SearchResult = {
  tasks: { id: number; title: string; project_id: number | null; area_id: number | null; when_date: string | null }[]
  projects: { id: number; name: string }[]
  areas: { id: number; name: string }[]
  tags: { id: number; name: string }[]
}
