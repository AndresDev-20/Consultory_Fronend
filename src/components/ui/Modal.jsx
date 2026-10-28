import { useEffect } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

function Modal({ title, eyebrow, description, onClose, children, footer, size = "md" }) {
  // Cerrar con Escape y bloquear el scroll del fondo
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return createPortal(
    <div className="Modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="Modal__overlay" onClick={onClose} />
      <section className={`Modal__panel Modal__panel--${size}`}>
        <header className="Modal__header">
          <div>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2 className="Modal__title">{title}</h2>
            {description && <p className="Modal__description">{description}</p>}
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar">
            <Icon name="x" size={18} />
          </button>
        </header>
        <div className="Modal__body">{children}</div>
        {footer && <footer className="Modal__footer">{footer}</footer>}
      </section>
    </div>,
    document.body,
  );
}

export default Modal;
