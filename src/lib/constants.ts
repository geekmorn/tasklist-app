export const TASKS_STORAGE_KEY = 'tasklist.tasks';
export const TASK_INIT_FLAG_KEY = 'tasklist.initialized';
export const TASK_PAGE_SIZE = 5;
export const TASK_MIN_TITLE = 3;
export const TASK_MAX_TITLE = 40;
export const TASK_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 7 days
export const DEFAULT_TASKS: Array<{ id: string; title: string; completed: boolean }> = [
  { id: '7kh25pxwd', title: 'Get shit done', completed: false },
  { id: '4p6wgde0i', title: 'Have lunch with colleagues', completed: false },
  { id: '55oe99ze4', title: 'Go home with a smile', completed: false },
  { id: 'k8s3q1mzp', title: 'Reply to important emails', completed: false },
  { id: 'v9n2x4btr', title: 'Review pull requests', completed: false },
];
