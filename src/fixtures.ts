// Static fixtures shaped exactly like API payloads — used by Storybook stories
// so the spec renders without a backend.
import type { ApiArea, ApiProject, ApiTag, ApiTask, Bootstrap } from "./api/types"

export const fixtureTags: ApiTag[] = [
  { id: 1, name: "Home" },
  { id: 2, name: "Work" },
  { id: 3, name: "Errand" },
  { id: 4, name: "Phone" },
]

export const fixtureTask: ApiTask = {
  id: 1,
  title: "Finish quarterly report",
  notes: "Q3 numbers + executive summary",
  when_date: "2026-09-28",
  reminder_at: "14:00",
  evening: false,
  deadline_date: "2026-09-28",
  status: "open",
  someday: false,
  trashed: false,
  completed_at: null,
  position: 1,
  project_id: 1,
  area_id: null,
  heading_id: null,
  tags: [fixtureTags[1]],
  checklist_items: [
    { id: 1, title: "Pull Q3 metrics", completed: true },
    { id: 2, title: "Write summary", completed: false },
    { id: 3, title: "Review with Dana", completed: false },
  ],
}

export const fixtureTasks: ApiTask[] = [
  { ...fixtureTask, id: 10, title: "Buy groceries", notes: "Milk, eggs, sourdough", reminder_at: "09:00", deadline_date: null, checklist_items: [], tags: [fixtureTags[0]] },
  { ...fixtureTask, id: 11, title: "Call the bank about the credit card", notes: null, reminder_at: "10:30", deadline_date: null, checklist_items: [], tags: [fixtureTags[3]] },
  fixtureTask,
  { ...fixtureTask, id: 12, title: "Pay electricity bill", notes: null, when_date: null, reminder_at: null, deadline_date: null, status: "completed", completed_at: "2026-09-26T10:00:00Z", checklist_items: [], tags: [] },
]

export const fixtureProjects: ApiProject[] = [
  { id: 1, name: "House", color: "#4a7cf5", notes: "Everything about the apartment", archived: false, area_id: 1, open_count: 2, total_count: 4 },
  { id: 2, name: "Quarter Close", color: "#f0923f", notes: "Wrap up Q3", archived: false, area_id: 2, open_count: 3, total_count: 5 },
  { id: 3, name: "Side Project", color: "#7c5cd6", notes: null, archived: false, area_id: null, open_count: 2, total_count: 3 },
  { id: 4, name: "Trip to Chiang Mai", color: "#2db8a6", notes: null, archived: false, area_id: 1, open_count: 2, total_count: 4 },
]

export const fixtureAreas: ApiArea[] = [
  { id: 1, name: "Personal" },
  { id: 2, name: "Work" },
]

export const fixtureBootstrap: Bootstrap = {
  user: { email: "demo@things.local", locale: "en", api_token: "spec-token" },
  areas: fixtureAreas,
  projects: fixtureProjects,
  tags: fixtureTags,
  counts: { today: 8, inbox: 4, anytime: 21, someday: 9, logbook: 27, trash: 0 },
}

/** No-op handlers for stories: TaskRow renders with its real mutation hooks
 * absent (stories have no QueryClient), so we pass inert stand-ins. */
export const noopHandlers = new Proxy({}, { get: () => () => {} }) as never
