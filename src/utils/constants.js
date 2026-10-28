// Valores que coinciden exactamente con los ENUM del backend

export const SEX_OPTIONS = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
  { value: "OTHER", label: "Otro" },
];

export const CIVIL_STATE_OPTIONS = [
  { value: "SOLTERO", label: "Soltero(a)" },
  { value: "CASADO", label: "Casado(a)" },
  { value: "UNION LIBRE", label: "Unión libre" },
  { value: "DIVORCIADO", label: "Divorciado(a)" },
  { value: "VIUD@", label: "Viudo(a)" },
];

export const APPOINTMENT_STATES = [
  { value: "Programada", label: "Programada", tone: "info" },
  { value: "Confirmada", label: "Confirmada", tone: "success" },
  { value: "Completada", label: "Completada", tone: "neutral" },
  { value: "Cancelada", label: "Cancelada", tone: "danger" },
  { value: "No asistió", label: "No asistió", tone: "warning" },
];

export const INVOICE_STATES = {
  Pendiente: "warning",
  Parcial: "info",
  Pagada: "success",
};

export const PAYMENT_METHODS = [
  "Efectivo",
  "Transferencia",
  "Tarjeta",
  "Nequi",
  "Daviplata",
];

export const PRODUCT_TYPES = [
  "Servicio",
  "Consulta",
  "Terapia",
  "Medicamento",
  "Suplemento",
  "Insumo",
];

export const ROLE_LABELS = {
  ADMIN: "Administrador",
  DOCTOR: "Profesional",
  SECRETARY: "Secretaría",
};

export const labelFrom = (options, value) =>
  options.find((option) => option.value === value)?.label ?? value ?? "—";
