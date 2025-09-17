import type { Task } from './types';

export function addTask(tasks: Task[], newTask: Task): Task[] {
  return [newTask, ...tasks];
}

export function updateTaskTitle(tasks: Task[], id: string, title: string): Task[] {
  return tasks.map((t) => (t.id === id ? { ...t, title } : t));
}

export function removeTasks(tasks: Task[], ids: string[]): Task[] {
  const idSet = new Set(ids);
  return tasks.filter((t) => !idSet.has(t.id));
}

export function buildDraftsFromTasks(
  prevDrafts: Record<string, { title: string; completed: boolean }>,
  tasks: Task[],
): Record<string, { title: string; completed: boolean }> {
  const next: Record<string, { title: string; completed: boolean }> = {};
  for (const t of tasks) {
    const existing = prevDrafts[t.id];
    next[t.id] = existing ? existing : { title: t.title, completed: t.completed };
  }
  return next;
}

export function setDraftCompletedForPage(
  drafts: Record<string, { title: string; completed: boolean }>,
  pageItems: Task[],
  checked: boolean,
) {
  const next = { ...drafts } as typeof drafts;
  for (const t of pageItems) {
    const existing = next[t.id] ?? { title: t.title, completed: t.completed };
    next[t.id] = { ...existing, completed: checked };
  }
  return next;
}

export function hasTitleChanged(
  task: Task,
  drafts: Record<string, { title: string; completed: boolean }>,
) {
  const draft = drafts[task.id];
  if (!draft) return false;
  return draft.title.trim() !== task.title;
}

export function getDraftCompleted(
  task: Task,
  drafts: Record<string, { title: string; completed: boolean }>,
) {
  return drafts[task.id]?.completed ?? task.completed;
}

export function deleteSelectedOnPage(
  tasks: Task[],
  drafts: Record<string, { title: string; completed: boolean }>,
  pageItems: Task[],
) {
  const idsToDelete = pageItems.filter((t) => getDraftCompleted(t, drafts)).map((t) => t.id);
  if (idsToDelete.length === 0) return { tasks, drafts, deletedCount: 0 };
  const nextTasks = removeTasks(tasks, idsToDelete);
  const nextDrafts = { ...drafts } as typeof drafts;
  for (const id of idsToDelete) delete nextDrafts[id];
  return { tasks: nextTasks, drafts: nextDrafts, deletedCount: idsToDelete.length };
}
