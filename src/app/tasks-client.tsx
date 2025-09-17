"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { TasksHeader } from "@/components/TasksHeader";
import { TasksToolbar } from "@/components/TasksToolbar";
import { TaskRow } from "@/components/TaskRow";
import { AnimatePresence, motion } from "framer-motion";
import { ConfirmBulkDeleteDialog, ConfirmSingleDeleteDialog } from "@/components/DeleteDialogs";
import { TasksPaginationFooter } from "@/components/TasksPaginationFooter";
import { isValidTitle as isValidTitleHelper, willExceedMax as willExceedMaxHelper } from "@/lib/task-helpers";
import type { Task } from "@/lib/types";
import { addTask, buildDraftsFromTasks, deleteSelectedOnPage, getDraftCompleted, hasTitleChanged, removeTasks, setDraftCompletedForPage, updateTaskTitle } from "@/lib/task-actions";
import { TASK_MAX_TITLE, TASK_MIN_TITLE, TASK_PAGE_SIZE, TASK_EXPIRATION_TIME, TASKS_STORAGE_KEY } from "@/lib/constants";


export default function TasksClient({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [query, setQuery] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [drafts, setDrafts] = useState<Record<string, { title: string; completed: boolean }>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmBulkOpen, setConfirmBulkOpen] = useState(false);
  const lastMaxToastAtRef = useRef(0);

  function isValidTitle(value: string) {
    return isValidTitleHelper(value, TASK_MIN_TITLE, TASK_MAX_TITLE);
  }

  function showMaxExceededToast() {
    const now = Date.now();
    if (now - lastMaxToastAtRef.current < 1000) return;
    lastMaxToastAtRef.current = now;
    toast.error(`Maximum ${TASK_MAX_TITLE} characters`, { duration: 1000 });
  }

  function willExceedMax(
    currentValue: string,
    insertValue: string,
    selectionStart: number | null,
    selectionEnd: number | null
  ) {
    return willExceedMaxHelper(currentValue, insertValue, selectionStart, selectionEnd, TASK_MAX_TITLE);
  }

  useEffect(() => {
    if (!initialTasks?.length) return;
    setTasks(initialTasks);
  }, [initialTasks]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    function setCookie(name: string, value: string, days = 365) {
      const expires = new Date(Date.now() + days * TASK_EXPIRATION_TIME).toUTCString();
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    }
    try {
      setCookie(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  useEffect(() => {
    setDrafts((prev) => buildDraftsFromTasks(prev, tasks));
  }, [tasks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => t.title.toLowerCase().includes(q));
  }, [tasks, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / TASK_PAGE_SIZE));
  const current = Math.min(currentPage, totalPages);
  const start = (current - 1) * TASK_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + TASK_PAGE_SIZE);
  const hasSelectionOnPage = !pageItems.every((t) => !isDraftCompleted(t));

  function createTask() {
    const title = newTitle.trim();
    if (!isValidTitle(title)) {
      toast.error(`Title must be ${TASK_MIN_TITLE}-${TASK_MAX_TITLE} characters`, { duration: 1000 });
      return;
    }
    const task: Task = {
      id: Math.random().toString(36).substring(2, 11),
      title,
      completed: false,
    };
    setTasks((prev) => addTask(prev, task));
    setNewTitle("");
    toast.success("Task created");
  }

  function setDraftTitle(id: string, title: string) {
    setDrafts((prev) => ({ ...prev, [id]: { ...(prev[id] ?? { title: "", completed: false }), title } }));
  }

  function toggleDraftCompleted(id: string) {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? { title: "", completed: false }), completed: !(prev[id]?.completed ?? false) },
    }));
  }

  function deleteTask(id: string) {
    setTasks((prev) => removeTasks(prev, [id]));
    setDrafts((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    toast.success("Task deleted");
  }

  function saveTask(id: string) {
    const draft = drafts[id];
    if (!draft) return;
    const title = draft.title.trim();
    if (!isValidTitle(title)) {
      toast.error(`Title must be ${TASK_MIN_TITLE}-${TASK_MAX_TITLE} characters`, { duration: 1000 });
      return;
    }
    setTasks((prev) => updateTaskTitle(prev, id, title));
    toast.success("Task saved");
  }

  function setPageCompleted(checked: boolean) {
    setDrafts((prev) => setDraftCompletedForPage(prev, pageItems, checked));
  }

  function hasChanges(task: Task) {
    return hasTitleChanged(task, drafts);
  }

  function isDraftCompleted(task: Task) {
    return getDraftCompleted(task, drafts);
  }

  function deleteSelected() {
    const result = deleteSelectedOnPage(tasks, drafts, pageItems);
    if (result.deletedCount === 0) return;
    setTasks(result.tasks);
    setDrafts(result.drafts);
    toast.success(`${result.deletedCount} task(s) deleted`);
  }

  return (
    <div className="min-h-dvh w-full px-4 sm:px-6 lg:px-8 py-6">
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <TasksHeader
            query={query}
            onQueryChange={(v) => { setQuery(v); setCurrentPage(1); }}
            onClear={() => { setQuery(""); setCurrentPage(1); }}
          />
        </CardHeader>
        <Separator />
        <CardContent>
          <TasksToolbar
            newTitle={newTitle}
            onNewTitleChange={setNewTitle}
            onBeforeInputNew={(e) => {
              const ev = e as unknown as InputEvent & { currentTarget: HTMLInputElement };
              const data = ev.data as string | null;
              if (data && willExceedMax(newTitle, data, ev.currentTarget.selectionStart, ev.currentTarget.selectionEnd)) {
                e.preventDefault();
                showMaxExceededToast();
              }
            }}
            onPasteNew={(e) => {
              const text = e.clipboardData.getData("text");
              const target = e.currentTarget as HTMLInputElement;
              if (willExceedMax(newTitle, text, target.selectionStart, target.selectionEnd)) {
                e.preventDefault();
                showMaxExceededToast();
              }
            }}
            onAdd={createTask}
            onSelectPage={() => setPageCompleted(true)}
            onClearPage={() => setPageCompleted(false)}
            onBulkDeleteConfirm={() => setConfirmBulkOpen(true)}
            canClearOrDelete={hasSelectionOnPage}
            hasSelection={hasSelectionOnPage}
          />

          <div className="mt-4 divide-y">
            {pageItems.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6">No tasks</p>
            ) : (
              <AnimatePresence initial={false}>
                {pageItems.map((task) => {
                  const currentTitle = drafts[task.id]?.title ?? task.title;
                  const currentCompleted = drafts[task.id]?.completed ?? task.completed;
                  const canSave = isValidTitle(currentTitle) && hasChanges(task);
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 1 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <TaskRow
                        task={task}
                        draftTitle={currentTitle}
                        draftCompleted={currentCompleted}
                        onTitleChange={setDraftTitle}
                        onToggleCompleted={toggleDraftCompleted}
                        onSave={saveTask}
                        onConfirmDelete={(id) => setConfirmDeleteId(id)}
                        canSave={canSave}
                        onBeforeInput={(id, e) => {
                          const current = drafts[id]?.title ?? task.title;
                          const ev = e as unknown as InputEvent & { currentTarget: HTMLInputElement };
                          const data = ev.data as string | null;
                          if (data && willExceedMax(current, data, ev.currentTarget.selectionStart, ev.currentTarget.selectionEnd)) {
                            e.preventDefault();
                            showMaxExceededToast();
                          }
                        }}
                        onPaste={(id, e) => {
                          const current = drafts[id]?.title ?? task.title;
                          const text = e.clipboardData.getData("text");
                          const target = e.currentTarget as HTMLInputElement;
                          if (willExceedMax(current, text, target.selectionStart, target.selectionEnd)) {
                            e.preventDefault();
                            showMaxExceededToast();
                          }
                        }}
                        maxLength={TASK_MAX_TITLE}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          <ConfirmSingleDeleteDialog
            confirmDeleteId={confirmDeleteId}
            onCancel={() => setConfirmDeleteId(null)}
            onConfirm={(id) => deleteTask(id)}
          />

          <ConfirmBulkDeleteDialog
            open={confirmBulkOpen}
            onOpenChange={setConfirmBulkOpen}
            onConfirm={deleteSelected}
            disabled={pageItems.every((t) => !isDraftCompleted(t))}
          />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <TasksPaginationFooter
            showingCount={pageItems.length}
            totalCount={filtered.length}
            current={current}
            totalPages={totalPages}
            onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
            onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            onGoto={(page) => setCurrentPage(page)}
          />
        </CardFooter>
      </Card>
    </div>
  );
}


