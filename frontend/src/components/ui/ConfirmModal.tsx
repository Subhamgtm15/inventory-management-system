"use client";

import Button from "./Button";
import Modal from "./Modal";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

// Reusable confirmation dialog shown before destructive actions (delete).
export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="text-sm text-gray-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
