"use client";

import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type TasksHeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onClear: () => void;
};

export function TasksHeader({ query, onQueryChange, onClear }: TasksHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <h1 className="text-xl font-semibold">Your daily routine</h1>
      <div className="flex w/full sm:w-auto items-center">
        <div className="relative w/full sm:w-72">
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search notes..."
            className="pr-9"
          />
          <AnimatePresence initial={false}>
            {query.trim().length > 0 && (
              <motion.button
                key="clear-inside"
                type="button"
                onClick={onClear}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-5 w-5 items-center justify-center rounded hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


