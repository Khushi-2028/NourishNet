import { FiAlertTriangle } from "react-icons/fi";
import Modal from "./Modal";
import Button from "./Button";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex gap-4">
        <div className="w-11 h-11 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
          <FiAlertTriangle className="text-rose-500" size={20} />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 pt-1.5">
          {description}
        </p>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={variant} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
