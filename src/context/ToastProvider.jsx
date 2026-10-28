import { useCallback, useMemo, useState } from "react";
import { ToastContext } from "./contexts";
import Icon from "../components/ui/Icon";

const ICONS = { success: "check", error: "alert", info: "info" };

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (type, message) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  const toast = useMemo(
    () => ({
      success: (message) => push("success", message),
      error: (message) => push("error", message),
      info: (message) => push("info", message),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="Toaster" role="status" aria-live="polite">
        {toasts.map((item) => (
          <div key={item.id} className={`Toast Toast--${item.type}`}>
            <Icon name={ICONS[item.type]} size={18} />
            <span className="Toast__message">{item.message}</span>
            <button
              type="button"
              className="Toast__close"
              onClick={() => dismiss(item.id)}
              aria-label="Cerrar notificación"
            >
              <Icon name="x" size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
