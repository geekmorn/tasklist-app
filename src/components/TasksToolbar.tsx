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
  allSelected: boolean;
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
  allSelected,
}: TasksToolbarProps) {
  const animationConfig = {
    duration: 0.2,
    ease: "easeInOut"
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center min-h-9">
      <AnimatePresence mode="wait" initial={false}>
        {!hasSelection ? (
          <motion.div
            key="add"
            className="flex-1 flex gap-2 items-center"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={animationConfig}
            layout
          >
            <motion.div 
              className="relative flex-1" 
              layout 
              transition={animationConfig}
            >
              <Input
                value={newTitle}
                onChange={(e) => onNewTitleChange(e.target.value)}
                placeholder="Add new task..."
                onBeforeInput={onBeforeInputNew}
                onPaste={onPasteNew}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onAdd();
                }}
                className="pr-9"
              />
              <AnimatePresence initial={false}>
                {newTitle.trim().length > 0 && (
                  <motion.button
                    type="button"
                    onClick={() => onNewTitleChange("")}
                    aria-label="Clear new task"
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-5 w-5 items-center justify-center rounded hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={animationConfig}
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
            <AnimatePresence initial={false}>
              {newTitle.trim().length > 0 && (
                <motion.div
                  key="add-btn"
                  initial={{ opacity: 0, scale: 0.9, x: -8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -8 }}
                  transition={animationConfig}
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
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={animationConfig}
          >
            <Button
              size="sm"
              variant="outline"
              onClick={allSelected ? onClearPage : onSelectPage}
              aria-label={allSelected ? "Clear page" : "Select page"}
              disabled={allSelected ? !canClearOrDelete : false}
            >
              <AnimatePresence mode="wait" initial={false}>
                {allSelected ? (
                  <motion.span
                    key="clear"
                    className="inline-flex items-center gap-2"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={animationConfig}
                  >
                    <Square />
                    <span className="hidden sm:inline">Clear</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="select"
                    className="inline-flex items-center gap-2"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={animationConfig}
                  >
                    <CheckSquare />
                    <span className="hidden sm:inline">Select</span>
                  </motion.span>
                )}
              </AnimatePresence>
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


