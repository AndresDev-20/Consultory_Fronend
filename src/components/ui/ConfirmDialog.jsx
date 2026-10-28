import { useState } from "react";
import Modal from "./Modal";
import Icon from "./Icon";

function ConfirmDialog({
  title = "¿Estás seguro?",
  message,
  confirmLabel = "Eliminar",
  onConfirm,
  onClose,
}) {
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // Quien llama ya muestra el error; el diálogo queda abierto para reintentar
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={title}
      onClose={busy ? undefined : onClose}
      size="sm"
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose} disabled={busy}>
            Cancelar
          </button>
          <button type="button" className="btn btn--danger" onClick={handleConfirm} disabled={busy}>
            {busy ? "Procesando..." : confirmLabel}
          </button>
        </>
      }
    >
      <div className="Confirm">
        <span className="Confirm__icon">
          <Icon name="alert" size={22} />
        </span>
        <p>{message}</p>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
