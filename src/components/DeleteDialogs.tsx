"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type SingleDeleteProps = {
  confirmDeleteId: string | null;
  onCancel: () => void;
  onConfirm: (id: string) => void;
};

export function ConfirmSingleDeleteDialog({ confirmDeleteId, onCancel, onConfirm }: SingleDeleteProps) {
  return (
    <Dialog open={Boolean(confirmDeleteId)} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete task?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirmDeleteId) onConfirm(confirmDeleteId);
              onCancel();
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type BulkDeleteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  disabled: boolean;
};

export function ConfirmBulkDeleteDialog({ open, onOpenChange, onConfirm, disabled }: BulkDeleteProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete selected tasks?</DialogTitle>
          <DialogDescription>This will delete all selected tasks on this page.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            disabled={disabled}
          >
            Delete selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


