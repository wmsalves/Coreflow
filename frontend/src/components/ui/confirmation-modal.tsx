"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

type ConfirmationModalProps = {
  cancelLabel: string;
  children?: ReactNode;
  confirmLabel: string;
  description: ReactNode;
  loading?: boolean;
  open: boolean;
  title: ReactNode;
  variant?: "danger" | "default";
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmationModal({
  cancelLabel,
  children,
  confirmLabel,
  description,
  loading = false,
  open,
  title,
  variant = "default",
  onCancel,
  onConfirm,
}: ConfirmationModalProps) {
  const confirmVariant = variant === "danger" ? "danger" : "primary";

  return (
    <Modal
      description={description}
      footer={
        <>
          <Button data-modal-initial-focus disabled={loading} onClick={onCancel} variant="secondary">
            {cancelLabel}
          </Button>
          <Button disabled={loading} onClick={onConfirm} variant={confirmVariant}>
            {loading ? `${confirmLabel}...` : confirmLabel}
          </Button>
        </>
      }
      open={open}
      title={title}
      onOpenChange={(nextOpen) => {
        if (!loading && !nextOpen) {
          onCancel();
        }
      }}
    >
      {children}
    </Modal>
  );
}
