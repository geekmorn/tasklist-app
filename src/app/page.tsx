import { cookies } from "next/headers";
import TasksClient from "@/app/tasks-client";
import { DEFAULT_TASKS, TASK_INIT_FLAG_KEY, TASKS_STORAGE_KEY } from "@/lib/constants";


export default async function Page() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(TASKS_STORAGE_KEY)?.value;
  const initialized = cookieStore.get(TASK_INIT_FLAG_KEY)?.value === "true";
  let initialTasks: Array<{ id: string; title: string; completed: boolean }> = [];
  if (raw) {
    try {
      initialTasks = JSON.parse(raw);
      if (!Array.isArray(initialTasks)) initialTasks = [];
    } catch {
      initialTasks = [];
    }
  } else if (!initialized) {
    initialTasks = DEFAULT_TASKS;
  }
  return <TasksClient initialTasks={initialTasks} />;
}
