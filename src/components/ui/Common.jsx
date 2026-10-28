import { cloneElement, isValidElement, useId } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";

export function PageHeader({ eyebrow, title, description, actions, back }) {
  const navigate = useNavigate();
  return (
    <header className="PageHeader">
      {back && (
        <button type="button" className="BackLink" onClick={() => navigate(back)}>
          <Icon name="arrowLeft" size={16} />
          Volver
        </button>
      )}
      <div className="PageHeader__row">
        <div className="PageHeader__text">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="PageHeader__title">{title}</h1>
          {description && <p className="PageHeader__description">{description}</p>}
        </div>
        {actions && <div className="PageHeader__actions">{actions}</div>}
      </div>
    </header>
  );
}

export function Loader({ label = "Cargando información..." }) {
  return (
    <div className="Loader">
      <span className="Loader__spinner" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="EmptyState EmptyState--error">
      <span className="EmptyState__icon">
        <Icon name="alert" size={26} />
      </span>
      <strong>No pudimos cargar los datos</strong>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--ghost" onClick={() => onRetry()}>
          <Icon name="refresh" size={16} />
          Reintentar
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon = "info", title, description, action }) {
  return (
    <div className="EmptyState">
      <span className="EmptyState__icon">
        <Icon name={icon} size={26} />
      </span>
      <strong>{title}</strong>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

export function Badge({ tone = "neutral", children }) {
  return <span className={`Badge Badge--${tone}`}>{children}</span>;
}

export function StatCard({ icon, label, value, hint, tone = "green" }) {
  return (
    <article className={`StatCard StatCard--${tone}`}>
      <span className="StatCard__icon">
        <Icon name={icon} size={22} />
      </span>
      <div className="StatCard__body">
        <span className="StatCard__label">{label}</span>
        <strong className="StatCard__value">{value}</strong>
        {hint && <span className="StatCard__hint">{hint}</span>}
      </div>
    </article>
  );
}

export function SearchInput({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <label className="SearchInput">
      <Icon name="search" size={18} />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

export function Field({ label, error, required, full, hint, children }) {
  const autoId = useId();
  // Asociamos la etiqueta al control (si el hijo directo es un input/select/textarea)
  const isControl = isValidElement(children) && ["input", "select", "textarea"].includes(children.type);
  const id = isControl ? (children.props.id ?? autoId) : undefined;

  return (
    <div className={`Field ${full ? "Field--full" : ""} ${error ? "Field--error" : ""}`}>
      {label && (
        <label className="Field__label" htmlFor={id}>
          {label} {required && <span className="Field__required">*</span>}
        </label>
      )}
      {isControl ? cloneElement(children, { id, "aria-invalid": Boolean(error) || undefined }) : children}
      {error ? (
        <small className="Field__error">{error.message}</small>
      ) : (
        hint && <small className="Field__hint">{hint}</small>
      )}
    </div>
  );
}

export function Avatar({ text, size = "md" }) {
  return <span className={`Avatar Avatar--${size}`}>{text}</span>;
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="Tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={`Tabs__tab ${active === tab.id ? "Tabs__tab--active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon && <Icon name={tab.icon} size={16} />}
          {tab.label}
          {tab.count !== undefined && <span className="Tabs__count">{tab.count}</span>}
        </button>
      ))}
    </div>
  );
}
