import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { tt } from "@/lib/i18n-shim"
import { api } from "./client"
import type { ApiTask, Bucket } from "./types"

/** Replace a task inside every cached task list (optimistic updates). */
function replaceTask(getQueriesData: ReturnType<ReturnType<typeof useQueryClient>["getQueriesData"]>, task: ApiTask) {
  return getQueriesData.map(([key, data]) => {
    if (!Array.isArray(key) || key[0] !== "tasks" || !Array.isArray(data)) return [key, data]
    return [key, (data as ApiTask[]).map((t) => (t.id === task.id ? task : t))]
  })
}

export function useBootstrap() {
  return useQuery({ queryKey: ["bootstrap"], queryFn: api.bootstrap, staleTime: 5_000 })
}

export function useTasks(bucket: Bucket) {
  return useQuery({ queryKey: ["tasks", bucket], queryFn: () => api.tasks(bucket) })
}

export function useProject(id: number) {
  return useQuery({ queryKey: ["project", id], queryFn: () => api.project(id) })
}

export function useArea(id: number) {
  return useQuery({ queryKey: ["area", id], queryFn: () => api.area(id) })
}

export function useInvalidate() {
  const qc = useQueryClient()
  return {
    all: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] })
      qc.invalidateQueries({ queryKey: ["bootstrap"] })
      qc.invalidateQueries({ queryKey: ["project"] })
      qc.invalidateQueries({ queryKey: ["area"] })
    },
    structure: () => {
      qc.invalidateQueries({ queryKey: ["bootstrap"] })
      qc.invalidateQueries({ queryKey: ["tasks"] })
      qc.invalidateQueries({ queryKey: ["project"] })
      qc.invalidateQueries({ queryKey: ["area"] })
    },
  }
}

/** All task mutations, bound to one task. Errors surface as toasts. */
export function useTaskMutations(task: ApiTask) {
  const qc = useQueryClient()
  const invalidate = useInvalidate()

  const action = (name: string, params?: Record<string, unknown>) =>
    api.taskAction(task.id, name, params)

  const optimistic = useMutation({
    mutationFn: (updated: ApiTask) => Promise.resolve(updated),
    onMutate: async (updated) => {
      await qc.cancelQueries({ queryKey: ["tasks"] })
      const prev = qc.getQueriesData({ queryKey: ["tasks"] })
      qc.setQueriesData({ queryKey: ["tasks"] }, (old: unknown) =>
        Array.isArray(old) ? (old as ApiTask[]).map((t) => (t.id === updated.id ? updated : t)) : old,
      )
      return { prev }
    },
    onError: (_e, _v, ctx) => ctx?.prev?.forEach(([k, d]) => qc.setQueryData(k, d)),
    onSettled: () => invalidate.all(),
  })

  const apply = (updated: ApiTask) => optimistic.mutate(updated)

  const fail = (e: unknown) => toast.error(tt("toast.error"), { description: String((e as Error).message) })

  const plain = <T,>(fn: () => Promise<T>, onDone?: (r: T) => void) =>
    fn().then((r) => {
      invalidate.all()
      onDone?.(r)
    }, fail)

  return {
    toggleComplete: () =>
      plain(() => action(task.status === "open" ? "complete" : "uncomplete"), (updated) => {
        if (updated.status === "completed") {
          toast.success(tt("toast.completed"), {
            action: { label: tt("toast.undo"), onClick: () => plain(() => action("uncomplete")) },
          })
        }
      }),
    cancel: () => plain(() => action("cancel")),
    schedule: (when_date: string | null, evening = false) =>
      when_date ? plain(() => action("schedule", { when_date, evening })) : plain(() => action("schedule", { clear: true })),
    scheduleSomeday: () => plain(() => action("schedule", { someday: true })),
    setEvening: (evening: boolean) => plain(() => action("schedule", { evening })),
    setDeadline: (deadline_date: string | null) => plain(() => action("deadline", { deadline_date })),
    setReminder: (reminder_at: string | null) => plain(() => action("remind", { reminder_at })),
    move: (params: { project_id?: number | null; area_id?: number | null; inbox?: boolean; heading_id?: number | null }) =>
      plain(() => action("move", params)),
    trash: () => plain(() => api.deleteTask(task.id), () => toast(tt("toast.trashed"), {
      action: { label: tt("toast.undo"), onClick: () => plain(() => api.taskAction(task.id, "restore")) },
    })),
    updateTitle: (title: string) => apply({ ...task, title }),
    updateNotes: (notes: string) => apply({ ...task, notes }),
    apply,
    addChecklistItem: (title: string) => plain(() => api.addChecklistItem(task.id, title)),
    toggleChecklistItem: (item: { id: number; completed: boolean }) =>
      plain(() => api.updateChecklistItem(task.id, item.id, { completed: !item.completed })),
    removeChecklistItem: (itemId: number) => plain(() => api.deleteChecklistItem(task.id, itemId)),
  }
}

export function useCreateTask() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: api.createTask,
    onSuccess: () => {
      invalidate.all()
      toast.success(tt("toast.added"))
    },
    onError: (e) => toast.error("Could not add", { description: (e as Error).message }),
  })
}

export function useCompleteAllToday() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: api.completeAllToday,
    onSuccess: () => {
      invalidate.all()
      toast.success(tt("toast.todayClear"))
    },
  })
}

export function useRestoreTask() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (id: number) => api.taskAction(id, "restore"),
    onSuccess: () => {
      invalidate.all()
      toast.success(tt("toast.restored"))
    },
  })
}

export function useEmptyTrash() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: api.emptyTrash,
    onSuccess: () => {
      invalidate.all()
      toast.success(tt("toast.trashEmptied"))
    },
  })
}

export function useCreateProject() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: api.createProject,
    onSuccess: () => {
      invalidate.structure()
      toast.success(tt("toast.listCreated"))
    },
    onError: (e) => toast.error("Could not create list", { description: (e as Error).message }),
  })
}

export function useCreateArea() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: api.createArea,
    onSuccess: () => {
      invalidate.structure()
      toast.success(tt("toast.areaCreated"))
    },
    onError: (e) => toast.error("Could not create area", { description: (e as Error).message }),
  })
}

export function useSearch(q: string) {
  return useQuery({
    queryKey: ["search", q],
    queryFn: () => api.search(q),
    enabled: q.trim().length > 0,
  })
}

export { replaceTask }
