const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export const formatCurrency = (value) => currencyFormatter.format(Number(value || 0));

export const formatDate = (value, options = {}) => {
  if (!value) return "—";
  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  });
};

export const formatTime = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateTime = (value) =>
  value ? `${formatDate(value)} · ${formatTime(value)}` : "—";

// "2026-10-28" se interpreta en hora local (no UTC) para evitar el desfase de un día
export const parseDate = (value) => {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(value);
};

const pad = (n) => String(n).padStart(2, "0");

// Fecha → "YYYY-MM-DD" en hora local
export const toDateInput = (value = new Date()) => {
  const date = parseDate(value);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

// Fecha → "YYYY-MM-DDTHH:mm" para <input type="datetime-local">
export const toDateTimeInput = (value = new Date()) => {
  const date = new Date(value);
  return `${toDateInput(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const isSameDay = (a, b) => {
  const x = new Date(a);
  const y = new Date(b);
  return (
    x.getFullYear() === y.getFullYear() &&
    x.getMonth() === y.getMonth() &&
    x.getDate() === y.getDate()
  );
};

export const fullName = (person) =>
  person ? `${person.firstNames ?? ""} ${person.lastNames ?? ""}`.trim() : "—";

export const initials = (text = "") =>
  text
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

export const normalize = (text = "") =>
  String(text)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// El backend responde errores con formas distintas; extraemos un mensaje legible
export const getErrorMessage = (error, fallback = "Ocurrió un error inesperado") => {
  if (!error?.response) {
    return error?.message === "Network Error"
      ? "No hay conexión con el servidor"
      : fallback;
  }
  const data = error.response.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (data.errors) return Object.values(data.errors).join(" · ");
  return data.message || data.error || data.Error || data.Err || data.Message || fallback;
};
