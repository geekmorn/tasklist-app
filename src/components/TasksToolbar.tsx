"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckSquare, Plus, Square, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type TasksToolbarProps = {
  newTitle: string;
  onNewTitleChange: (value: string) => void;
  onBeforeInputNew: (e: React.FormEvent<HTMLInputElement>) => void;
  onPasteNew: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onAdd: () => void;
  onSelectPage: () => void;
  onClearPage: () => void;
  onBulkDeleteConfirm: () => void;
  canClearOrDelete: boolean;
  hasSelection: boolean;
};

export function TasksToolbar({
  newTitle,
  onNewTitleChange,
  onBeforeInputNew,
  onPasteNew,
  onAdd,
  onSelectPage,
  onClearPage,
  onBulkDeleteConfirm,
  canClearOrDelete,
  hasSelection,
}: TasksToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center min-h-9">
      <AnimatePresence mode="wait" initial={false}>
        {!hasSelection ? (
          <motion.div
            key="add"
            className="flex-1 flex gap-2 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            layout
          >
            <motion.div className="relative flex-1" layout transition={{ duration: 0.15, ease: "easeInOut" }}>
              <Input
                value={newTitle}
                onChange={(e) => onNewTitleChange(e.target.value)}
                placeholder="New note"
                onBeforeInput={onBeforeInputNew}
                onPaste={onPasteNew}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onAdd();
                }}
                className="pr-9"
              />
              {newTitle.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => onNewTitleChange("")}
                  aria-label="Clear new task"
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-5 w-5 items-center justify-center rounded hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </motion.div>
            <AnimatePresence initial={false}>
              {newTitle.trim().length > 0 && (
                <motion.div
                  key="add-btn"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  layout
                >
                  <Button size="sm" onClick={onAdd}>
                    <Plus />
                    <span className="hidden sm:inline">Add</span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="bulk"
            className="flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
          >
            <Button size="sm" variant="outline" onClick={onSelectPage} aria-label="Select page">
              <CheckSquare />
              <span className="hidden sm:inline">Select</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onClearPage}
              aria-label="Clear page"
              disabled={!canClearOrDelete}
            >
              <Square />
              <span className="hidden sm:inline">Clear</span>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onBulkDeleteConfirm}
              disabled={!canClearOrDelete}
              aria-label="Delete selected"
            >
              <Trash2 />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


