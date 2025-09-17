"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Save as SaveIcon, Trash2, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Task } from "@/lib/types";

type TaskRowProps = {
  task: Task;
  draftTitle: string;
  draftCompleted: boolean;
  onTitleChange: (id: string, title: string) => void;
  onToggleCompleted: (id: string) => void;
  onSave: (id: string) => void;
  onConfirmDelete: (id: string) => void;
  canSave: boolean;
  onBeforeInput: (id: string, e: React.FormEvent<HTMLInputElement>) => void;
  onPaste: (id: string, e: React.ClipboardEvent<HTMLInputElement>) => void;
  maxLength: number;
};

export function TaskRow({
  task,
  draftTitle,
  draftCompleted,
  onTitleChange,
  onToggleCompleted,
  onSave,
  onConfirmDelete,
  canSave,
  onBeforeInput,
  onPaste,
  maxLength,
}: TaskRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      const el = inputRef.current;
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    }
  }, [isEditing]);

  useEffect(() => {
    function handleDocumentMouseDown(ev: MouseEvent) {
      if (!isEditing) return;
      const target = ev.target as Node | null;
      if (rowRef.current && target && !rowRef.current.contains(target)) {
        if (draftTitle !== task.title) {
          onTitleChange(task.id, task.title);
        }
        setIsEditing(false);
      }
    }
    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () => document.removeEventListener("mousedown", handleDocumentMouseDown);
  }, [isEditing, draftTitle, task.id, task.title, onTitleChange]);

  function handleStartEdit() {
    setIsEditing(true);
  }

  function handleSave() {
    if (!canSave) return;
    onSave(task.id);
    setIsEditing(false);
  }

  function handleRowClick() {
    if (isEditing) return;
    onToggleCompleted(task.id);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      if (draftTitle !== task.title) {
        onTitleChange(task.id, task.title);
      }
      setIsEditing(false);
      (e.currentTarget as HTMLInputElement).blur();
    }
  }

  return (
    <div ref={rowRef} className="flex flex-row items-center gap-3 py-3" onClick={handleRowClick}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Checkbox
          checked={draftCompleted}
          onCheckedChange={() => onToggleCompleted(task.id)}
          onClick={(e) => e.stopPropagation()}
        />
        <Input
          ref={inputRef}
          value={draftTitle}
          onChange={(e) => onTitleChange(task.id, e.target.value)}
          className={"min-w-0 truncate"}
          disabled={!isEditing}
          onKeyDown={handleKeyDown}
          onBeforeInput={(e) => onBeforeInput(task.id, e)}
          onPaste={(e) => onPaste(task.id, e)}
          maxLength={maxLength}
        />
      </div>
      <div className="hidden sm:flex gap-2 shrink-0">
        {isEditing ? (
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => { e.stopPropagation(); handleSave(); }}
            disabled={!canSave}
            aria-label="Save values"
          >
            <SaveIcon />
            <span className="hidden sm:inline">Save</span>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => { e.stopPropagation(); handleStartEdit(); }}
            aria-label="Edit task"
          >
            <Pencil />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        )}
        <Button
          size="sm"
          variant="destructive"
          onClick={(e) => { e.stopPropagation(); onConfirmDelete(task.id); }}
          aria-label="Delete task"
        >
          <Trash2 />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>
      <div className="sm:hidden shrink-0 flex gap-2">
        {isEditing ? (
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => { e.stopPropagation(); handleSave(); }}
            disabled={!canSave}
            aria-label="Save values"
          >
            <SaveIcon />
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => { e.stopPropagation(); handleStartEdit(); }}
            aria-label="Edit task"
          >
            <Pencil />
          </Button>
        )}
        <Button
          size="sm"
          variant="destructive"
          onClick={(e) => { e.stopPropagation(); onConfirmDelete(task.id); }}
          aria-label="Delete task"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}


